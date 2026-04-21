import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Freshari | তাজা সবজি সরাসরি কৃষকের হাত থেকে",
  description:
    "Freshari provides organic and fresh vegetables directly from farms in Bangladesh.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-screen bg-white text-slate-900 font-sans"
        suppressHydrationWarning={true}
      >
        <Toaster position="top-center" reverseOrder={false} />

        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
