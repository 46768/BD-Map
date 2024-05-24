import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MapDisplay from "./components/MapDisplay";
import Sidebar from "./components/Sidebar/Sidebar";
import Sidegroup from "./components/Sidebar/Sidegroup";
import SideLabel from "./components/Sidebar/SideLabel";

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
        
          <Sidebar>
            <SideLabel>Tools</SideLabel>
            <SideLabel>Test</SideLabel>
          </Sidebar>
        
        <div className="w-auto inline-block m-4 absolute top-0">
          {children}
        </div>
      </body>
    </html>
  );
}
