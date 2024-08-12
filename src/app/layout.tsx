import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Reto Programador Jr",
  description: "Reto hecho por Jose Arturo Arguelles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextUIProvider>
          {children}
          <ToastContainer />
        </NextUIProvider>
      </body>
    </html>
  );
}
