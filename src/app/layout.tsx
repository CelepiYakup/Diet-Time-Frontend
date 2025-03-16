import type { Metadata } from "next";
import "./styles/globals.scss";
import ClientLayout from "./components/ClientLayout";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from './context/ToastContext';

export const metadata: Metadata = {
  title: "Diet Time",
  description: "Track your meals and nutrition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <AuthProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
