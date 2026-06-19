import type { Metadata } from "next";
import "./globals.css";
import { StateProvider } from "@/lib/state";

export const metadata: Metadata = {
  title: "Premrog",
  description: "Premrog Social Media Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  return (
    <html lang="en">
      <body className="selection:bg-pink-200 selection:text-black">
        <StateProvider>
          {children}
        </StateProvider>
      </body>
    </html>
  );
}