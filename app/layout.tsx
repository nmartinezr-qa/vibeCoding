import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/src/contexts/ToastContext";
import { DialogProvider } from "@/src/contexts/DialogContext";
import ToastContainer from "@/src/components/ToastContainer";
import DialogContainer from "@/src/components/DialogContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VibeCooking - Recipe Management",
  description: "Modern recipe management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pt-[4rem]`}
      >
        <DialogProvider>
          <ToastProvider>
            {children}
            <DialogContainer />
            <ToastContainer />
          </ToastProvider>
        </DialogProvider>
      </body>
    </html>
  );
}
