import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://diamondc-restaurant.com"),
  title: "Diamond C | Luxury Restaurant & Fine Dining - Douala, Cameroon",
  description: "Experience authentic Cameroonian delicacies and fine dining in an opulent, gold-kissed setting at Diamond C Restaurant in Douala. Achu, Eru, Ndolé, Poisson Braisé, and VIP Lounge.",
  keywords: "Diamond C, Luxury Restaurant Douala, Cameroonian cuisine, Achu, Ndolé, Eru, Poisson Braisé, Kati Kati, fine dining Cameroon",
  openGraph: {
    title: "Diamond C | Luxury Dining - Douala, Cameroon",
    description: "Authentic Cameroonian gastronomy & royal hospitality.",
    url: "https://diamondc-restaurant.com",
    siteName: "Diamond C Restaurant",
    images: [
      {
        url: "/images/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Diamond C Luxury Restaurant",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0B0B0B] text-zinc-100 selection:bg-[#D4AF37] selection:text-black">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1 flex flex-col pt-16 sm:pt-20">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
