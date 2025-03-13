"use client";

import { SessionProvider } from "next-auth/react";
import './globals.css'
import "react-quill/dist/quill.snow.css";


export default function RootLayout({ children }) {
  return (
    <SessionProvider>
       <html> 
        <body>{children}</body>
      </html>
    </SessionProvider>
  );
}
