import { pageSEO } from "@/serverApi/game";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";
import ProviderWrapper from "./ProviderWrapper";
import { SeonProvider } from "./SeonProvider";
import TopLoader from "./TopLoader";
import Script from "next/script";

const metadata: Metadata = {
  title: "Sweepstake",
  description: "Sweepstake - Online Gaming Platform",
  icons: {
    icon: "/assets/images/logo.png",
  },
};
export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await pageSEO();
    const seoData = response;

    return {
      title: seoData?.data?.site_name || metadata.title,
      description: seoData?.data?.site_description || metadata.description,
      openGraph: {
        title: seoData?.data?.site_name || seoData?.data?.site_name || metadata.title,
        description: seoData?.data?.site_description || seoData?.data?.site_description || metadata.description,
        images: seoData?.data?.logo ? [seoData.logo] : ["/assets/images/logo.png"],
      },
      icons: seoData?.data?.favicon || metadata.icons,
    };
  } catch (error) {
    console.error("SEO metadata fetch failed:", error);
    return metadata;
  }
}
const inter = Inter({
  subsets: ['latin'],
  fallback: ['sans-serif'],
  weight: ['300', '400', '500', '700'],
  adjustFontFallback: false
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* className="dark" */}
      <body className={`${inter.className} scroll-smooth`} cz-shortcut-listen="true">
        <SeonProvider>
          <ProviderWrapper>
            <React.Suspense fallback={<div />}>
              <TopLoader />
            </React.Suspense>
            {children}
          </ProviderWrapper>
        </SeonProvider>
      </body>
    </html>
  );
}
