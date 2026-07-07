import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://super-mesh.vercel.app"),
  title: "SuperMesh — Verifiable Physical Data Infrastructure",
  description:
    "SuperMesh is decentralized physical infrastructure on Solana. Hardware-attested environmental data, secured by stake.",
  icons: { icon: "/assets/logo-mark.png" },
  openGraph: {
    title: "SuperMesh — Verifiable Physical Data Infrastructure",
    description: "Hardware-attested environmental data, secured by stake on Solana.",
    images: ["/assets/twitter-banner.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;450;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
