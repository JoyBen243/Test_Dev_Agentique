"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Watch } from "lucide-react"

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirection intelligente temporaire
    // Plus tard, nous lirons useSettingsStore pour savoir si l'onboarding est terminé.
    const isFirstTime = true // À lier avec Zustand par la suite

    const timer = setTimeout(() => {
      if (isFirstTime) {
        router.push('/onboarding')
      } else {
        router.push('/dashboard')
      }
    }, 1500) // Petit délai pour montrer l'écran de lancement (Splash screen)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
      {/* Icône de montre "Lucide-React" pour le logo agrandie */}
      <Watch className="w-32 h-32 text-indigo-500 animate-pulse mb-6" strokeWidth={1.5} />
      
      <h1 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-2">
        My_MudaPlan
      </h1>
      <p className="text-slate-500 font-medium tracking-widest uppercase text-xs">
        Chargement...
      </p>
    </div>
  )
}