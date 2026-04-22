import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

import Footer from "@/components/Footer";

const oswald = Oswald({
    variable: "--font-oswald",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Connexxa | Situs Resmi Adidas Indonesia",
    description: "Belanja koleksi terbaru sepatu, pakaian, dan aksesori olahraga di Connexxa. Gratis ongkir untuk pembelian tertentu.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${oswald.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
            </body>
        </html>
    );
}

