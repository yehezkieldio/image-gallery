import type React from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Image Lazy Loading Comparison",
    description: "Compare native lazy loading vs Intersection Observer API for image loading performance",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className} suppressHydrationWarning>
                <>
                    {children}
                    <Toaster />
                </>
            </body>
        </html>
    );
}
