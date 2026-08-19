import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/Navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "My_MudaPlan",
  description: "Application de gestion d'agenda offline-first",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-50 antialiased overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Conteneur principal mobile-first centré sur grand écran */}
          <div className="flex flex-col min-h-[100dvh]">
            <main className="flex-1 w-full max-w-md mx-auto relative shadow-2xl bg-white dark:bg-slate-950 overflow-x-hidden flex flex-col">
              {children}
            </main>
            
            {/* Bottom Navigation fixée en bas, restreinte à la largeur mobile */}
            <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
              <div className="w-full max-w-md pointer-events-auto">
                <Navigation />
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
