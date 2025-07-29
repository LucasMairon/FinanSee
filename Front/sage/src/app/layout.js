import { Roboto } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "../hooks/context";

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "600"], // <= pesos que você quer
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "FinanSee",
  description: "Clareza, controle e consciência financeira.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
