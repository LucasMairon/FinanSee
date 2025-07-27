import { Roboto } from "next/font/google";
import "./globals.css";

// Libs
import { Toaster } from "react-hot-toast";

// Context
import { AuthProvider } from "../hooks/context";

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "600"],
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
      <body className={roboto.variable}>
        <AuthProvider>
          <Toaster
            position="top-center"
            gutter={8}
            toastOptions={{
              style: {
                background: "#363636",
                color: "#fff",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              },
              duration: 5000,
              success: {
                duration: 3000,
                theme: {
                  primary: "green",
                  secondary: "black",
                },
                style: {
                  background: "#EAF7ED",
                  color: "#1A5D1A",
                },
              },
              error: {
                style: {
                  background: "#FDE2E2",
                  color: "#B91C1C",
                },
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
