import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AIChatbot from "../components/AIChatbot";
import { AuthModal } from "../components/AuthModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bihareduconnect.online"),
  alternates: {
    canonical: "/",
  },
  title: "BiharEduConnect - Best UGEAC & BCECE Counselling Predictor 2026",
  description: "BiharEduConnect is the best Bihar BTech admission and college predictor platform. Calculate your BCECE UGEAC admission chances, check cutoffs, seat matrices, and fees for 38+ government engineering colleges.",
  keywords: "BiharEduConnect, Bihar Engineering Counselling, BCECE, UGEAC 2026, MIT Muzaffarpur, Bihar College Predictor, Bihar BTech Admission, BCE Bhagalpur",
  authors: [{ name: "BiharEduConnect Team" }],
  openGraph: {
    title: "BiharEduConnect - Best UGEAC & BCECE Counselling Predictor",
    description: "BiharEduConnect is the best Bihar BTech admission and college predictor platform. Calculate your BCECE UGEAC admission chances.",
    type: "website",
    locale: "en_IN",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth overflow-x-hidden`}>
      <body className="min-h-full flex flex-col bg-white dark:bg-slate-950 text-slate-800 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden">
        <AppProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <AIChatbot />
          <AuthModal />
        </AppProvider>
      </body>
    </html>
  );
}
