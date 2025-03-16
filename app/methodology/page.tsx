import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function MethodologyPage() {
    return (
        <main className="min-h-screen p-4 md:p-8">
            <div className="container mx-auto space-y-6">
                <Button variant="outline" asChild className="mb-4">
                    <Link href="/">← Back to Gallery</Link>
                </Button>

                <h1 className="font-bold text-3xl tracking-tight md:text-4xl">Research Methodology</h1>
                <p className="max-w-3xl text-muted-foreground">
                    This page outlines the methodology used to compare the two lazy loading techniques and how the
                    performance metrics are collected and analyzed.
                </p>

                <Tabs defaultValue="setup" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="setup">Experimental Setup</TabsTrigger>
                        <TabsTrigger value="metrics">Metrics Collection</TabsTrigger>
                        <TabsTrigger value="scenarios">Test Scenarios</TabsTrigger>
                        <TabsTrigger value="analysis">Data Analysis</TabsTrigger>
                    </TabsList>

                    <TabsContent value="setup" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Experimental Setup</CardTitle>
                                <CardDescription>How the comparison environment is configured</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-medium text-lg">Image Gallery Configuration</h3>
                                    <p className="text-muted-foreground text-sm">
                                        The gallery consists of 50 images of varying sizes (small: 400×300px, medium:
                                        800×600px, large: 1600×1200px) arranged in a responsive grid layout. Each image
                                        is loaded with the same quality settings to ensure a fair comparison.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium text-lg">Implementation Details</h3>
                                    <p className="text-muted-foreground text-sm">
                                        <strong>Native Lazy Loading:</strong> Images use the HTML{" "}
                                        <code>loading="lazy"</code> attribute with Next.js Image component.
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        <strong>Intersection Observer:</strong> A custom React hook implements the
                                        Intersection Observer API to detect when images enter the viewport.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium text-lg">Testing Environment</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Tests are conducted across multiple devices (desktop, tablet, mobile) and
                                        network conditions (fast, medium, slow) to provide comprehensive performance
                                        data.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="metrics" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Metrics Collection</CardTitle>
                                <CardDescription>How performance data is gathered</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-medium text-lg">Performance Metrics</h3>
                                    <ul className="list-disc space-y-1 pl-5">
                                        <li>
                                            <strong>Initial Load Time:</strong> Time from navigation start to
                                            DOMContentLoaded event
                                        </li>
                                        <li>
                                            <strong>Visible Images Load Time:</strong> Time taken for above-the-fold
                                            images to load completely
                                        </li>
                                        <li>
                                            <strong>Memory Usage:</strong> Peak memory consumption during page
                                            interaction
                                        </li>
                                        <li>
                                            <strong>Network Activity:</strong> Number of requests and total data
                                            transferred
                                        </li>
                                        <li>
                                            <strong>CPU Utilization:</strong> JavaScript execution time and main thread
                                            blocking
                                        </li>
                                        <li>
                                            <strong>Cumulative Layout Shift (CLS):</strong> Visual stability measurement
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-medium text-lg">Collection Methods</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Metrics are collected using the Web Performance API, including Navigation
                                        Timing, Resource Timing, and Performance Observer. Additional data is gathered
                                        using browser DevTools protocols.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="scenarios" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Test Scenarios</CardTitle>
                                <CardDescription>Different conditions tested</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-medium text-lg">Device Types</h3>
                                    <ul className="list-disc space-y-1 pl-5">
                                        <li>
                                            <strong>Desktop:</strong> High-performance computer with large viewport
                                        </li>
                                        <li>
                                            <strong>Tablet:</strong> Mid-range device with medium viewport
                                        </li>
                                        <li>
                                            <strong>Mobile:</strong> Low-power device with small viewport
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-medium text-lg">Network Conditions</h3>
                                    <ul className="list-disc space-y-1 pl-5">
                                        <li>
                                            <strong>Fast:</strong> Fiber/Cable connection (50+ Mbps)
                                        </li>
                                        <li>
                                            <strong>Medium:</strong> 4G mobile connection (5-10 Mbps)
                                        </li>
                                        <li>
                                            <strong>Slow:</strong> 3G mobile connection (1-2 Mbps)
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-medium text-lg">User Interaction Patterns</h3>
                                    <ul className="list-disc space-y-1 pl-5">
                                        <li>
                                            <strong>Slow Scroll:</strong> Gradual scrolling through the gallery
                                        </li>
                                        <li>
                                            <strong>Fast Scroll:</strong> Rapid scrolling to the bottom
                                        </li>
                                        <li>
                                            <strong>Jump Scroll:</strong> Jumping to specific sections
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analysis" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Data Analysis</CardTitle>
                                <CardDescription>How results are processed and interpreted</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-medium text-lg">Statistical Methods</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Performance data is analyzed using statistical methods to determine significant
                                        differences between the two lazy loading techniques. This includes calculating
                                        means, medians, standard deviations, and conducting t-tests for statistical
                                        significance.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium text-lg">Visualization</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Results are visualized using charts and graphs to make the performance
                                        differences more apparent. This includes bar charts for direct comparisons, line
                                        charts for time-series data, and heat maps for identifying performance
                                        bottlenecks.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium text-lg">Interpretation Framework</h3>
                                    <p className="text-muted-foreground text-sm">
                                        A weighted scoring system is used to evaluate the overall performance of each
                                        technique, taking into account the relative importance of different metrics for
                                        various use cases.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}
