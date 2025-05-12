import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";
import LayoutWrapper from "./components/layoutWrapper";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: 'swap',
});

export const metadata = {
  title: "Iron Tribe",
  description: "Created by Polycarb & Khamlangba",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased` } suppressHydrationWarning>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
