import { Raleway, Noto_Sans } from "next/font/google";

export const raleway = Raleway({
  subsets: ['latin-ext'], 
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-raleway',
});

export const noto_sans = Noto_Sans({
  subsets: ['latin-ext'], 
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-noto-sans',
});
