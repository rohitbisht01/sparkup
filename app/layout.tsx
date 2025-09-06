import type { Metadata } from "next"; 
import "./globals.css";
import { Recursive } from "next/font/google"; 

const recursive = Recursive({
  subsets: ["latin"],
});
 
export const metadata: Metadata = {
  title: "Sparkup – Connect & Chat",
  description: "A modern chat application where you can connect with friends, send requests, and start meaningful conversations.",
  keywords: [
    "chat app",
    "messaging",
    "real-time chat",
    "friends",
    "connect",
    "social app",
    "dating style chat"
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={recursive.className}>
        {children}
      </body>
    </html>
  );
}
