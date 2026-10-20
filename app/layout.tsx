import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Zuno CRM",
  description: "Protótipo de CRM com funil, central de mensagens e WhatsApp oficial ou uazapi",
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html lang="pt-BR" className={cn("h-full antialiased font-sans", inter.variable)}>
    <body className="h-full">
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster position="bottom-right" richColors />
    </body>
  </html>
);

export default RootLayout;
