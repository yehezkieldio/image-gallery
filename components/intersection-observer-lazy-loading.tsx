"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Generate an array of image objects with different sizes (same as native component)
const generateImages = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        width: [400, 800, 1600][i % 3], // Cycle through different widths
        height: [300, 600, 1200][i % 3], // Corresponding heights
        alt: `Sample image ${i + 1}`,
        visible: false, // Track visibility for Intersection Observer
    }));
};

export default function IntersectionObserverLazyLoading() {
    const [images, setImages] = useState<
        Array<{ id: number; width: number; height: number; alt: string; visible: boolean }>
    >([]);
    const [loadedImages, setLoadedImages] = useState<number>(0);
    const observers = useRef<Map<number, IntersectionObserver>>(new Map());

    useEffect(() => {
        // Generate 50 images with varying sizes
        setImages(generateImages(50));

        // Reset loaded images counter
        setLoadedImages(0);

        // Start performance measurement
        if (typeof window !== "undefined") {
            performance.mark("intersection-observer-start");
        }

        return () => {
            // Disconnect all observers
            // observers.current.forEach((observer) => {
            //     observer.disconnect();
            // });
            for (const observer of observers.current.values()) {
                observer.disconnect();
            }
            observers.current.clear();

            // Clean up performance marks
            if (typeof window !== "undefined") {
                performance.clearMarks("intersection-observer-start");
                performance.clearMeasures("intersection-observer-loading");
            }
        };
    }, []);

    const handleImageLoad = () => {
        setLoadedImages((prev) => {
            const newCount = prev + 1;

            // When all visible images are loaded, measure performance
            if (newCount === images.filter((img) => img.visible).length && typeof window !== "undefined") {
                performance.mark("intersection-observer-end");
                performance.measure(
                    "intersection-observer-loading",
                    "intersection-observer-start",
                    "intersection-observer-end"
                );

                const measures = performance.getEntriesByName("intersection-observer-loading");
                if (measures.length > 0) {
                    toast.message("Intersection Observer Loading Complete", {
                        description: `${newCount} visible images loaded in ${measures[0].duration.toFixed(2)}ms`,
                    });
                }
            }

            return newCount;
        });
    };

    const observerCallback = (id: number) => (entries: IntersectionObserverEntry[]) => {
        // entries.forEach((entry) => {
        //     if (entry.isIntersecting) {
        //         // Update the image visibility state
        //         setImages((prevImages) => prevImages.map((img) => (img.id === id ? { ...img, visible: true } : img)));

        //         // Disconnect the observer for this image
        //         const observer = observers.current.get(id);
        //         if (observer) {
        //             observer.disconnect();
        //             observers.current.delete(id);
        //         }
        //     }
        // });
        for (const entry of entries) {
            if (entry.isIntersecting) {
                // Update the image visibility state
                setImages((prevImages) => prevImages.map((img) => (img.id === id ? { ...img, visible: true } : img)));

                // Disconnect the observer for this image
                const observer = observers.current.get(id);
                if (observer) {
                    observer.disconnect();
                    observers.current.delete(id);
                }
            }
        }
    };

    const setObserverRef = (id: number) => (element: HTMLDivElement | null) => {
        if (element && !observers.current.has(id)) {
            const observer = new IntersectionObserver(observerCallback(id), {
                root: null,
                rootMargin: "100px", // Load images 100px before they enter viewport
                threshold: 0.1,
            });

            observer.observe(element);
            observers.current.set(id, observer);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="font-medium text-sm">
                    Images Loaded: {loadedImages} / {images.filter((img) => img.visible).length} visible (of{" "}
                    {images.length} total)
                </p>
                <div className="ml-4 h-2 w-full max-w-xs rounded-full bg-secondary">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{
                            width:
                                images.filter((img) => img.visible).length > 0
                                    ? `${(loadedImages / images.filter((img) => img.visible).length) * 100}%`
                                    : "0%",
                        }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {images.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                        <CardContent className="p-0">
                            <div
                                className="relative"
                                style={{ aspectRatio: `${image.width}/${image.height}` }}
                                ref={setObserverRef(image.id)}
                            >
                                {image.visible ? (
                                    <Image
                                        src={`https://placehold.co/${image.height}x${image.width}/svg`}
                                        alt={image.alt}
                                        fill
                                        className="object-cover"
                                        loading="eager" // Disable native lazy loading
                                        onLoad={handleImageLoad}
                                    />
                                ) : (
                                    <div className="h-full w-full animate-pulse bg-muted" />
                                )}
                            </div>
                            <div className="p-2">
                                <p className="text-muted-foreground text-xs">
                                    {image.width}×{image.height} • Image {image.id}
                                    {!image.visible && " (not yet visible)"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
