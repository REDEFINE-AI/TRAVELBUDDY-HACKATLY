import type { Metadata } from "next";
import { Hubot_Sans } from "next/font/google";
import "./globals.css";
import PrelineScript from "./components/PrelineScript";
import BottomNav from "./components/BottomNav";

const hubotSans = Hubot_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "TravelBuddy",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${hubotSans.className} antialiased bg-white text-gray-900`}>
        {children}
        <BottomNav />
      </body>
      <PrelineScript />
    </html>
  );
}
