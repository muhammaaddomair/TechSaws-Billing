import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TechSaws Billing",
  description: "Invoice generator for development services and client subscriptions."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
