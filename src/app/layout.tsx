// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script' // 👈 Importa Script

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MP4 a MP3',
  description: 'Analytics de google',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* Google Analytics - Script externo */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        {/* Google Analytics - Código inline */}
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8L8JZTC3BH');
          `}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
