"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Generate an array of image objects with different sizes
const generateImages = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        width: [400, 800, 1600][i % 3], // Cycle through different widths
        height: [300, 600, 1200][i % 3], // Corresponding heights
        alt: `Sample image ${i + 1}`,
    }));
};

export default function NativeLazyLoading() {
    const [images, setImages] = useState<Array<{ id: number; width: number; height: number; alt: string }>>([]);
    const [loadedImages, setLoadedImages] = useState<number>(0);

    useEffect(() => {
        // Generate 50 images with varying sizes
        setImages(generateImages(50));

        // Reset loaded images counter
        setLoadedImages(0);

        // Start performance measurement
        if (typeof window !== "undefined") {
            performance.mark("native-lazy-start");
        }

        return () => {
            // Clean up performance marks
            if (typeof window !== "undefined") {
                performance.clearMarks("native-lazy-start");
                performance.clearMeasures("native-lazy-loading");
            }
        };
    }, []);

    const handleImageLoad = () => {
        setLoadedImages((prev) => {
            const newCount = prev + 1;

            // When all images are loaded, measure performance
            if (newCount === images.length && typeof window !== "undefined") {
                performance.mark("native-lazy-end");
                performance.measure("native-lazy-loading", "native-lazy-start", "native-lazy-end");

                const measures = performance.getEntriesByName("native-lazy-loading");
                if (measures.length > 0) {
                    // toast({
                    //     title: "Native Lazy Loading Complete",
                    //     description: `All ${images.length} images loaded in ${measures[0].duration.toFixed(2)}ms`,
                    // });
                    toast.message("Native Lazy Loading Complete", {
                        description: `All ${images.length} images loaded in ${measures[0].duration.toFixed(2)}ms`,
                    });
                }
            }

            return newCount;
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="font-medium text-sm">
                    Images Loaded: {loadedImages} / {images.length}
                </p>
                <div className="ml-4 h-2 w-full max-w-xs rounded-full bg-secondary">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${(loadedImages / images.length) * 100}%` }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {images.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="relative" style={{ aspectRatio: `${image.width}/${image.height}` }}>
                                <Image
                                    src={`https://placehold.co/${image.height}x${image.width}/svg`}
                                    alt={image.alt}
                                    fill
                                    className="object-cover"
                                    loading="lazy" // Native lazy loading
                                    onLoad={handleImageLoad}
                                />
                            </div>
                            <div className="p-2">
                                <p className="text-muted-foreground text-xs">
                                    {image.width}×{image.height} • Image {image.id}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
