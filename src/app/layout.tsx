import type { Metadata } from "next";
import "./globals.css";

import * as Fonts from '@/app/fonts/index';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { TmdbProvider } from "@/components/contexts/tmdbContext";

export const metadata: Metadata = {
  title: "ZiloCine Filmes e Series",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-br">
      <body className={
        `${ Fonts.poppins.variable }
          ${ Fonts.roboto.variable }
          ${ Fonts.noto_sans.variable }
          ${ Fonts.raleway.variable }
      `}>
        <TmdbProvider>
          <Header/>
          { children }
          <Footer/>
        </TmdbProvider>

      </body>
    </html>
  );
}
