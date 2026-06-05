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
  title: "BiharEduConnect - Bihar Engineering Counselling & College Predictor 2026",
  description: "Calculate your BCECE UGEAC admission chances. Discover cutoffs, seat matrices, fee structures, and compare 38+ government engineering colleges in Bihar.",
  keywords: "Bihar Engineering Counselling, BCECE, UGEAC 2026, MIT Muzaffarpur, Bihar College Predictor, Bihar BTech Admission, BCE Bhagalpur",
  authors: [{ name: "BiharEduConnect Team" }],
  openGraph: {
    title: "BiharEduConnect - Bihar Engineering Counselling",
    description: "Predict engineering colleges in Bihar based on JEE Main / BCECE rank. Get round-wise cutoff analysis and counselling guidelines.",
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
