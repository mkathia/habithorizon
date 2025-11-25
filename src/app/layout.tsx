import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Habit Horizon",
    description: "Build and break habits with Habit Horizon",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
