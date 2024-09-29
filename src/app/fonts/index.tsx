import { Poppins, Raleway, Noto_Sans, Roboto } from "next/font/google";

export const poppins = Poppins({
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export const raleway = Raleway({
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-raleway',
});

export const noto_sans = Noto_Sans({
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-noto-sans',
});

export const roboto = Roboto({
  subsets: ['latin'], 
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
});