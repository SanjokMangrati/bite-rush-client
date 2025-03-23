import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { AuthProvider } from "@/lib/context/auth.context";
import { OrderProvider } from "@/lib/context/order.context";
import { PaymentProvider } from "@/lib/context/payment.context";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BiteRush - Food Ordering App",
  description: "Order your favorite food from local restaurants",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <OrderProvider>
            <PaymentProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
              </div>
              <Toaster />
            </PaymentProvider>
          </OrderProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
