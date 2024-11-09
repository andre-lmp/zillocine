import type { Metadata } from "next";
import "./globals.css";

import * as Fonts from '@/app/fonts/index';

import Header from "@/components/header";
import Footer from "@/components/footer";
import LoginModal from "@/components/authenticateUsers/loginModal";
import RegisterModal from "@/components/authenticateUsers/registerModal";
import ProfileModal from "@/components/profileModal";

// Contextos
import { TmdbProvider } from "@/components/contexts/tmdbContext";
import { GlobalEventsProvider } from "@/components/contexts/globalEventsContext";
import { UserDataProvider } from "@/components/contexts/authenticationContext";

import { ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.css';

export const metadata: Metadata = {
  title: "ZiloCine Filmes e Series",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="pt-br">
      <body className={ `${ Fonts.poppins.variable } ${ Fonts.roboto.variable } ${ Fonts.noto_sans.variable } ${ Fonts.raleway.variable } `}>
        <div className="relative overflow-x-hidden max-w-[2200px] mx-auto min-h-screen flex flex-col justify-between">
          <TmdbProvider>
              <UserDataProvider>
                <GlobalEventsProvider>
                  <Header/>
                  <LoginModal/>
                  <RegisterModal/>
                  <ProfileModal/>
                  <ToastContainer/>
                  { children }
                  <Footer/>
                </GlobalEventsProvider>
              </UserDataProvider>
          </TmdbProvider>
        </div>
      </body>
    </html>
  );
}
