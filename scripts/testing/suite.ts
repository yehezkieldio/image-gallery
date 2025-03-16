import fs from "node:fs/promises";
import lighthouse from "lighthouse";
import puppeteer, { type Browser, type Page } from "puppeteer";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
async function runLightHouse(browser: Browser, url: string, deviceProfile: any, networkCondition: any) {
    try {
        // Run Lighthouse
        const result = await lighthouse(url, {
            logLevel: "info",
            output: "json",
            onlyCategories: ["performance"],
            port: new URL(browser.wsEndpoint()).port as unknown as number,
            throttlingMethod: "devtools",
            formFactor: deviceProfile.name.toLowerCase() === "mobile" ? "mobile" : "desktop",
            screenEmulation: {
                width: deviceProfile.viewport.width,
                height: deviceProfile.viewport.height,
                deviceScaleFactor: 1,
                mobile: deviceProfile.name.toLowerCase() === "mobile",
            },
            throttling: {
                rttMs: networkCondition.latency,
                throughputKbps: networkCondition.download / 1024,
                cpuSlowdownMultiplier: 1,
            },
        });

        return {
            // @ts-expect-error
            performance: Math.round(result?.lhr?.categories?.performance?.score * 100),
            firstContentfulPaint: result?.lhr?.audits["first-contentful-paint"]?.numericValue
                ? `${(result.lhr.audits["first-contentful-paint"].numericValue / 1000).toFixed(2)} s`
                : "N/A",

            largestContentfulPaint: result?.lhr?.audits["largest-contentful-paint"]?.displayValue,
            totalBlockingTime: result?.lhr?.audits["total-blocking-time"]?.displayValue,
            cumulativeLayoutShift: result?.lhr?.audits["cumulative-layout-shift"]?.displayValue,
            speedIndex: result?.lhr?.audits["speed-index"]?.displayValue,
        };
    } catch (error) {
        console.error("Error running Lighthouse:", error);
        return null;
    }
}

const deviceProfiles = {
    desktop: {
        name: "Desktop",
        viewport: { width: 1920, height: 1080 },
        userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
    tablet: {
        name: "Tablet",
        viewport: { width: 1024, height: 768 },
        userAgent:
            "Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1",
    },
    mobile: {
        name: "Mobile",
        viewport: { width: 375, height: 667 },
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1",
    },
};

const networkConditions = {
    fast: {
        name: "Fast (Fiber/Cable)",
        download: 50 * 1024 * 1024, // 50 Mbps
        upload: 25 * 1024 * 1024, // 25 Mbps
        latency: 5, // ms
    },
    medium: {
        name: "Medium (4G)",
        download: 7 * 1024 * 1024, // 7 Mbps
        upload: 3 * 1024 * 1024, // 3 Mbps
        latency: 100, // ms
    },
    slow: {
        name: "Slow (3G)",
        download: 1.5 * 1024 * 1024, // 1.5 Mbps
        upload: 750 * 1024, // 0.75 Mbps
        latency: 200, // ms
    },
};

const scrollPatterns = {
    slow: {
        name: "Slow Scroll",
        distance: 100,
        interval: 200, // slower scrolling
    },
    fast: {
        name: "Fast Scroll",
        distance: 300,
        interval: 50, // rapid scrolling
    },
    jump: {
        name: "Jump Scroll",
        sections: [0.25, 0.5, 0.75, 1], // scroll to 25%, 50%, 75%, and 100%
    },
};

async function performScroll(page: Page, pattern: keyof typeof scrollPatterns) {
    if (pattern === "jump") {
        await page.evaluate(async (sections) => {
            const height = document.documentElement.scrollHeight;
            for (const section of sections) {
                window.scrollTo(0, height * section);
                await new Promise((resolve) => setTimeout(resolve, 500));
            }
            window.scrollTo(0, 0);
        }, scrollPatterns.jump.sections);
        return;
    }

    const { distance, interval } = scrollPatterns[pattern];
    await page.evaluate(
        async ({ distance, interval }) => {
            await new Promise<void>((resolve) => {
                let totalHeight = 0;
                const timer = setInterval(() => {
                    const scrollHeight = document.documentElement.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        window.scrollTo(0, 0);
                        resolve();
                    }
                }, interval);
            });
        },
        { distance, interval }
    );
}

async function collectMetrics(page: Page) {
    // Collect FCP and LCP before other metrics
    const performanceMetrics = await page.evaluate(() => {
        return new Promise((resolve) => {
            let fcpTime: number | null = null;
            let lcpTime: number | null = null;

            const fcpObserver = new PerformanceObserver((entryList) => {
                fcpTime = entryList.getEntries()[0].startTime;
                fcpObserver.disconnect(); // 🛠️ Disconnect after collecting data
            });
            fcpObserver.observe({ type: "paint", buffered: true });

            const lcpObserver = new PerformanceObserver((entryList) => {
                lcpTime = entryList.getEntries().pop()?.startTime || null;
                lcpObserver.disconnect(); // 🛠️ Disconnect after collecting data
            });
            lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

            setTimeout(() => {
                resolve({
                    FCP: fcpTime ? `${fcpTime.toFixed(2)}ms` : "Not available",
                    LCP: lcpTime ? `${lcpTime.toFixed(2)}ms` : "Not available",
                });
            }, 10000);
        });
    });

    // Collect existing metrics
    const existingMetrics = await page.evaluate(() => {
        const cards = document.querySelectorAll("[data-slot='card']");
        const metrics: Record<string, string> = {};

        for (const card of cards) {
            const title = card.querySelector(".font-medium")?.textContent || "";
            const value = card.querySelector(".font-bold")?.textContent || "";
            if (title && value) {
                metrics[title.trim()] = value.trim();
            }
        }

        return metrics;
    });

    // Combine both metrics
    const combinedMetrics = {
        // @ts-expect-error
        ...performanceMetrics,
        ...existingMetrics,
    };

    console.log("Performance Metrics:", combinedMetrics);
    return combinedMetrics;
}

async function runDeviceTest(
    browser: Browser,
    deviceProfile: (typeof deviceProfiles)[keyof typeof deviceProfiles],
    networkCondition: (typeof networkConditions)[keyof typeof networkConditions],
    scrollPattern: keyof typeof scrollPatterns
) {
    const page = await browser.newPage();
    await page.setUserAgent(deviceProfile.userAgent);
    await page.setViewport(deviceProfile.viewport);

    const client = await page.createCDPSession();
    await client.send("Network.enable");
    await client.send("Network.emulateNetworkConditions", {
        offline: false,
        downloadThroughput: networkCondition.download / 8, // Convert to bytes/s
        uploadThroughput: networkCondition.upload / 8, // Convert to bytes/s
        latency: networkCondition.latency,
    });

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const results: Record<string, any> = {};

    try {
        const MAX_RETRIES = 2;
        let attempt = 0;
        while (attempt < MAX_RETRIES) {
            try {
                await page.goto("http://localhost:3000", { waitUntil: "load", timeout: 30000 });
                break; // Success, exit loop
            } catch (_error) {
                console.warn(`Attempt ${attempt + 1}: Page failed to load, retrying...`);
                attempt++;
                if (attempt === MAX_RETRIES) throw new Error("Page failed to load after multiple attempts.");
            }
        }

        // console.log(`Running Lighthouse audit for ${deviceProfile.name} with ${networkCondition.name} network...`);
        // results.lighthouse = await runLightHouse(browser, "http://localhost:3000", deviceProfile, networkCondition);

        await page.waitForSelector("main");
        await page
            .waitForSelector('img[loading="lazy"]', { timeout: 5000 })
            .catch(() => console.warn("Lazy images not found"));

        console.log(`Testing Native Lazy Loading with ${scrollPatterns[scrollPattern].name}...`);
        await page.evaluate(async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        });

        await performScroll(page, scrollPattern);
        await page.evaluate(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });
        results.nativeLazyLoading = await collectMetrics(page);

        console.log(`Testing Intersection Observer with ${scrollPatterns[scrollPattern].name}...`);
        await page.waitForSelector('[id^="radix-"][id$="-trigger-intersection-observer"]');
        await page.click('[id^="radix-"][id$="-trigger-intersection-observer"]');

        await page.evaluate(async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        });

        await performScroll(page, scrollPattern);
        await page.evaluate(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });
        results.intersectionObserver = await collectMetrics(page);

        return results;
    } finally {
        await page.close();
    }
}

async function runTests() {
    console.log("Starting Puppeteer tests across devices, networks, and scroll patterns...");
    const browser = await puppeteer.launch();
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const results: Record<string, Record<string, Record<string, Record<string, any>>>> = {};

    try {
        for (const [device, profile] of Object.entries(deviceProfiles)) {
            results[device] = {};
            console.log(`\nTesting on ${profile.name}...`);

            for (const [network, condition] of Object.entries(networkConditions)) {
                results[device][network] = {};
                console.log(`\nTesting with ${condition.name} network...`);

                for (const scrollPattern of Object.keys(scrollPatterns) as Array<keyof typeof scrollPatterns>) {
                    console.log(`\nTesting with ${scrollPatterns[scrollPattern].name} pattern...`);
                    results[device][network][scrollPattern] = await runDeviceTest(
                        browser,
                        profile,
                        condition,
                        scrollPattern
                    );
                }
            }
        }

        await fs.writeFile(
            "./test-results.json",
            JSON.stringify(
                {
                    timestamp: new Date().toISOString(),
                    results,
                },
                null,
                2
            )
        );

        console.log("\nTests completed! Results saved to test-results.json");
    } catch (error) {
        console.error("Tests failed:", error);
    } finally {
        await browser.close();
    }
}

runTests().catch((error) => {
    console.error("Error running tests:", error);
});
