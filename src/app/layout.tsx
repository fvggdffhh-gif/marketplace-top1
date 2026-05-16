import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { DiscountProvider } from "@/context/DiscountContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AussieFarm - Australian Marketplace",
  description: "Quality chainsaws, mowers, fishing gear & construction tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <DiscountProvider>
              {children}
            </DiscountProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
