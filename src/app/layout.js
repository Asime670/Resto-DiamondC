import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import CartDrawer from "@/components/public/CartDrawer";

// Headlines — Playfair Display (Didot style luxury neoclassical serif)
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

// Body text — Montserrat
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
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
      className={`${playfair.variable} ${montserrat.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0B0B0B] text-zinc-100 selection:bg-[#D4AF37] selection:text-black">
        <LanguageProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1 flex flex-col pt-16 sm:pt-20">
              {children}
            </main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
