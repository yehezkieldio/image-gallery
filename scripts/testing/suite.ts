import fs from "node:fs/promises";
import puppeteer, { type Page } from "puppeteer";

async function collectMetrics(page: Page) {
    return await page.evaluate(() => {
        const cards = document.querySelectorAll("[data-slot='card']");
        const metrics: Record<string, string> = {};

        for (const card of cards) {
            const title = card.querySelector(".font-medium")?.textContent || "";
            const value = card.querySelector(".font-bold")?.textContent || "";
            if (title && value) {
                metrics[title.trim()] = value.trim();
            }
        }

        console.log("Performance Metrics:", metrics);
        return metrics;
    });
}

async function autoScroll(page: Page) {
    await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.documentElement.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    window.scrollTo(0, 0);
                    resolve();
                }
            }, 100);
        });
    });
}

async function runTest() {
    console.log("Starting Puppeteer test...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const results: Record<string, any> = {};

    try {
        await page.setViewport({ width: 1280, height: 800 });

        await page.goto("http://localhost:3000");
        await page.waitForSelector("main");

        console.log("Testing Native Lazy Loading...");
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                setTimeout(resolve, 2000);
            });
        });

        await autoScroll(page);
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
        });
        results.nativeLazyLoading = await collectMetrics(page);

        console.log("Testing Intersection Observer...");
        await page.waitForSelector('[id^="radix-"][id$="-trigger-intersection-observer"]');
        await page.click('[id^="radix-"][id$="-trigger-intersection-observer"]');

        await page.evaluate(async () => {
            await new Promise((resolve) => {
                setTimeout(resolve, 2000);
            });
        });

        await autoScroll(page);
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
        });
        results.intersectionObserver = await collectMetrics(page);

        await fs.writeFile("./test-results.json", JSON.stringify(results, null, 2));

        console.log("Test completed! Results saved to test-results.json");
    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        await browser.close();
    }
}

runTest().catch(console.error);
