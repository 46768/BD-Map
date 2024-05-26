import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MapDisplay from "./components/MapDisplay";
import Sidebar from "./components/Sidebar/Sidebar";
import Sidegroup from "./components/Sidebar/Sidegroup";
import SideLabel from "./components/Sidebar/SideLabel";
import SideLink from "./components/Sidebar/SideLink";
import SideBtn from "./components/Sidebar/SideBtn";
import Navbar from "./components/Navbar/Navbar";
import { useState } from "react";
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
    <html lang="en" data-theme="winter" className=" bg-gray-950 overflow-hidden">
      <body className={inter.className}>
        <Navbar>
          <NavLabel>BD Navigator  V0.0.0.0</NavLabel>
        </Navbar>

        <div className="pt-2 pl-4 absolute top-24">
          {children}
        </div>
      </body>
    </html>
  );
}
