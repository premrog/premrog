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
      <body className="bg-black text-white selection:bg-pink-500 selection:text-white">
        <StateProvider>
          {children}
        </StateProvider>
      </body>
    </html>
  );
}