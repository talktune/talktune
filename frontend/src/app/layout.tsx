import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { InterviewContextProvider } from "@/context/InterviewContext";
import Providers from "./provider";
export const metadata: Metadata = {
  title: "TalkTune",
  description: "",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={"en"}>
      <body className={poppins.className}>
        <Providers>
          <InterviewContextProvider>
            {children}
          </InterviewContextProvider>
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;
