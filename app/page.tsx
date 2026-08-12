"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Watch } from "lucide-react"
import { useSettingsStore } from "@/store/useSettingsStore"

export default function RootPage() {
  const router = useRouter()
  const isOnboarded = useSettingsStore((state) => state.isOnboarded)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const timer = setTimeout(() => {
      if (!isOnboarded) {
        router.push('/onboarding')
      } else {
        router.push('/dashboard')
      }
    }, 1200)

    return () => clearTimeout(timer)
  }, [router, isOnboarded, mounted])

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