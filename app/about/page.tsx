import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="min-h-screen p-4 md:p-8">
            <div className="container mx-auto space-y-6">
                <Button variant="outline" asChild className="mb-4">
                    <Link href="/">← Back to Gallery</Link>
                </Button>

                <h1 className="font-bold text-3xl tracking-tight md:text-4xl">About This Project</h1>
                <p className="max-w-3xl text-muted-foreground">
                    This website was developed as part of an undergraduate thesis project to compare and benchmark
                    different image lazy loading techniques in modern web development.
                </p>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Objective</CardTitle>
                            <CardDescription>The primary research goals</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>
                                To compare the performance characteristics of native HTML lazy loading versus
                                JavaScript's Intersection Observer API across different devices, network conditions, and
                                image quantities.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Native Lazy Loading</CardTitle>
                            <CardDescription>HTML attribute approach</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>
                                The <code>loading="lazy"</code> attribute is a native HTML feature that defers loading
                                off-screen images until the user scrolls near them. It's built into modern browsers with
                                no JavaScript required.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Intersection Observer</CardTitle>
                            <CardDescription>JavaScript API approach</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>
                                The Intersection Observer API provides a way to asynchronously observe changes in the
                                intersection of elements with their containing viewport, allowing for more control but
                                requiring JavaScript implementation.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Metrics Collected</CardTitle>
                            <CardDescription>Performance data points</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc space-y-1 pl-5">
                                <li>Initial page load time</li>
                                <li>Time to load visible images</li>
                                <li>Memory usage</li>
                                <li>Network requests</li>
                                <li>CPU utilization</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Technologies Used</CardTitle>
                            <CardDescription>Development stack</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc space-y-1 pl-5">
                                <li>Next.js (React framework)</li>
                                <li>Tailwind CSS (styling)</li>
                                <li>Web Performance API</li>
                                <li>Next.js Image component</li>
                                <li>Custom performance hooks</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Research Applications</CardTitle>
                            <CardDescription>Practical implications</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>
                                The findings from this research can help web developers make informed decisions about
                                which lazy loading technique to implement based on their specific use cases, target
                                audience, and performance requirements.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
