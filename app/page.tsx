"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Watch } from "lucide-react"
import { useSettingsStore } from "@/store/useSettingsStore"

export default function RootPage() {
  const router = useRouter()
  const isOnboarded = useSettingsStore((state) => state.isOnboarded)
  const hasHydrated = useSettingsStore((state) => state._hasHydrated)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Ne rien faire tant que le composant n'est pas monté et que Zustand n'a pas lu le localStorage
    if (!mounted || !hasHydrated) return

    const timer = setTimeout(() => {
      if (!isOnboarded) {
        router.push('/onboarding')
      } else {
        router.push('/dashboard')
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [router, isOnboarded, mounted, hasHydrated])

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-slate-950 text-white p-6">
      {/* Icône de montre "Lucide-React" pour le logo */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full"></div>
        <Watch className="w-28 h-28 text-indigo-500 animate-pulse relative z-10" strokeWidth={1.5} />
      </div>
      
      <h1 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-2">
        My_MudaPlan
      </h1>
      <p className="text-slate-500 font-medium tracking-widest uppercase text-xs">
        Chargement...
      </p>
    </div>
  )
}