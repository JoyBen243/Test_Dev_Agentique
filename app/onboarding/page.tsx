"use client"
import { Watch, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen p-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 mt-10">
        
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full"></div>
          <Watch className="w-48 h-48 text-indigo-600 dark:text-indigo-400 relative z-10" strokeWidth={1} />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tight">
            Reprenez le contrôle de votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Temps</span>.
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
            Planifiez, exécutez et suivez vos objectifs avec My_MudaPlan. Même sans connexion internet.
          </p>
        </div>

      </div>

      <div className="pb-10 pt-4">
        <button 
          onClick={() => router.push('/dashboard')}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg shadow-indigo-600/30"
        >
          Commencer <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
