import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import cx from "classnames";
import { sfPro, inter } from "./fonts";
import Nav from "@/../components/layout/nav";
import Footer from "@/../components/layout/footer";
import { Suspense } from "react";

export const metadata = {
  title: "Surri AI - transforming the way you transcribe",
  description:
    "Surri AI uses Artificial Intelligence and the OpenAI Whisper-v3 model to power lightning fast transcription of audio sources.",
  metadataBase: new URL("https://precedent.dev"),
  themeColor: "#FFF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cx(sfPro.variable, inter.variable)}>
        <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-green-100" />
        <Suspense fallback="...">
          <Nav />
        </Suspense>
        <main className="flex min-h-screen w-full flex-col items-center justify-center py-32">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
