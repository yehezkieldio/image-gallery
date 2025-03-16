import IntersectionObserverLazyLoading from "@/components/intersection-observer-lazy-loading";
import NativeLazyLoading from "@/components/native-lazy-loading";
import PerformanceMetrics from "@/components/performance-metrics";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function Home() {
    return (
        <main className="min-h-screen p-4 md:p-8">
            <div className="container mx-auto space-y-6">
                <header className="space-y-2">
                    <h1 className="font-bold text-3xl tracking-tight md:text-4xl">Image Lazy Loading Comparison</h1>
                    <p className="text-muted-foreground">
                        Compare the performance of native <code>loading="lazy"</code> attribute versus JavaScript's
                        Intersection Observer API
                    </p>
                </header>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h2 className="font-semibold text-xl">Performance Benchmark</h2>
                        <p className="text-muted-foreground text-sm">
                            Toggle between methods to compare loading behavior and performance
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/about">About This Project</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/methodology">Research Methodology</Link>
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="native" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="native">Native Lazy Loading</TabsTrigger>
                        <TabsTrigger value="intersection-observer">Intersection Observer</TabsTrigger>
                    </TabsList>
                    <TabsContent value="native" className="space-y-4">
                        <div className="rounded-lg border bg-card p-4 shadow-sm">
                            <h3 className="mb-2 font-medium text-lg">
                                Native <code>loading="lazy"</code>
                            </h3>
                            <p className="mb-4 text-muted-foreground text-sm">
                                Using the HTML attribute <code>loading="lazy"</code> which is natively supported by
                                modern browsers.
                            </p>
                            <PerformanceMetrics type="native" />
                            <NativeLazyLoading />
                        </div>
                    </TabsContent>
                    <TabsContent value="intersection-observer" className="space-y-4">
                        <div className="rounded-lg border bg-card p-4 shadow-sm">
                            <h3 className="mb-2 font-medium text-lg">Intersection Observer API</h3>
                            <p className="mb-4 text-muted-foreground text-sm">
                                Using JavaScript's Intersection Observer API to detect when images enter the viewport.
                            </p>
                            <PerformanceMetrics type="intersection-observer" />
                            <IntersectionObserverLazyLoading />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}
