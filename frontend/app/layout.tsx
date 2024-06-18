import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import NavLabel from "./components/Navbar/NavLabel";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BD Navigator",
  description: "Interactive Map For Bodindecha School",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="winter" className="overflow-hidden">
      <body className={inter.className}>
        <div className="fixed top-0 left-0 w-screen h-screen">
          <Navbar>
            <NavLabel>BD Navigator V0.0.0.0</NavLabel>
          </Navbar>

          {children}
        </div>
      </body>
    </html>
  );
}
