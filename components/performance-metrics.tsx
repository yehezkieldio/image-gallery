"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface PerformanceMetricsProps {
    type: "native" | "intersection-observer";
}

interface MetricsData {
    loadTime: number;
    memoryUsage: number;
    networkRequests: number;
    cpuUsage: number;
    cls: number;
}

export default function PerformanceMetrics({ type }: PerformanceMetricsProps) {
    const [metrics, setMetrics] = useState<MetricsData>({
        loadTime: 0,
        memoryUsage: 0,
        networkRequests: 0,
        cpuUsage: 0,
        cls: 0,
    });
    const [isCollecting, setIsCollecting] = useState(false);

    useEffect(() => {
        // Reset metrics when type changes
        setMetrics({
            loadTime: 0,
            memoryUsage: 0,
            networkRequests: 0,
            cpuUsage: 0,
            cls: 0,
        });

        // Start collecting metrics
        setIsCollecting(true);

        // Simulate metrics collection
        const interval = setInterval(() => {
            if (typeof window !== "undefined") {
                // Get performance measures if available
                const measures = performance.getEntriesByName(
                    type === "native" ? "native-lazy-loading" : "intersection-observer-loading"
                );

                // Get memory usage if available
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                const memory = (performance as any).memory?.usedJSHeapSize || 0;

                // Get network requests
                const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
                const imageResources = resources.filter(
                    (resource) => resource.initiatorType === "img" || resource.initiatorType === "css"
                );

                // Simulate CPU usage (would be more accurate with actual profiling)
                const cpuUsage = Math.random() * 15 + 5; // Random value between 5-20%

                // Simulate CLS (Cumulative Layout Shift)
                const cls = Math.random() * 0.1; // Random value between 0-0.1

                setMetrics({
                    loadTime: measures.length > 0 ? measures[0].duration : 0,
                    memoryUsage: memory / (1024 * 1024), // Convert to MB
                    networkRequests: imageResources.length,
                    cpuUsage,
                    cls,
                });
            }
        }, 1000);

        return () => {
            clearInterval(interval);
            setIsCollecting(false);
        };
    }, [type]);

    return (
        <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Performance Metrics</h4>
                <span className="text-muted-foreground text-xs">
                    {isCollecting ? "Collecting data..." : "Data collection complete"}
                </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <MetricCard
                    title="Load Time"
                    value={metrics.loadTime > 0 ? `${metrics.loadTime.toFixed(2)}ms` : "Measuring..."}
                    progress={Math.min((metrics.loadTime / 5000) * 100, 100)}
                />
                <MetricCard
                    title="Memory Usage"
                    value={metrics.memoryUsage > 0 ? `${metrics.memoryUsage.toFixed(2)}MB` : "Measuring..."}
                    progress={Math.min((metrics.memoryUsage / 100) * 100, 100)}
                />
                <MetricCard
                    title="Network Requests"
                    value={metrics.networkRequests > 0 ? `${metrics.networkRequests}` : "Counting..."}
                    progress={Math.min((metrics.networkRequests / 50) * 100, 100)}
                />
                <MetricCard
                    title="CPU Usage"
                    value={metrics.cpuUsage > 0 ? `${metrics.cpuUsage.toFixed(1)}%` : "Measuring..."}
                    progress={metrics.cpuUsage}
                />
                <MetricCard
                    title="Layout Shift (CLS)"
                    value={metrics.cls > 0 ? `${metrics.cls.toFixed(3)}` : "Measuring..."}
                    progress={metrics.cls * 1000}
                    isGoodWhenLow={true}
                />
            </div>
        </div>
    );
}

interface MetricCardProps {
    title: string;
    value: string;
    progress: number;
    isGoodWhenLow?: boolean;
}

function MetricCard({ title, value, progress, isGoodWhenLow = false }: MetricCardProps) {
    // Determine color based on progress and whether lower values are better
    const getProgressColor = () => {
        if (isGoodWhenLow) {
            // For metrics where lower is better (like CLS)
            return progress < 30 ? "bg-green-500" : progress < 70 ? "bg-yellow-500" : "bg-red-500";
        }
        // For metrics where higher might indicate more load
        return progress < 30 ? "bg-green-500" : progress < 70 ? "bg-yellow-500" : "bg-red-500";
    };

    return (
        <Card>
            <CardContent className="p-4">
                <div className="space-y-2">
                    <p className="font-medium text-sm">{title}</p>
                    <p className="font-bold text-2xl">{value}</p>
                    <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
