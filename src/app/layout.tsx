import type { Metadata } from "next";
import "./globals.css";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";

export const viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://rsproperty.com.bd'),
  title: "RS Property Development | LandVista Bangladesh",
  description: "Buy, Sell and Invest in Verified Properties Across Bangladesh. Luxury real estate platform.",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LandVista',
  },
  openGraph: {
    title: "RS Property Development",
    description: "Premium real estate and land development company in Bangladesh. Specializing in plots, commercial spaces, and luxury housing.",
    url: 'https://rsproperty.com.bd',
    siteName: 'RS Property Development',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "RS Property Development",
    description: "Premium real estate and land development company in Bangladesh.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
