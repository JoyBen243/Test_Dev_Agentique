"use client"
import { Moon, Sun, Volume2, Globe } from "lucide-react"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { setTheme, theme } = useTheme()

  return (
    <div className="flex flex-col min-h-full p-6 pb-24">
      <header className="mb-8 mt-4">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Paramètres</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Personnalisez votre expérience</p>
      </header>

      <div className="space-y-6">
        {/* Section Apparence */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Apparence</h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Mode Sombre</span>
              </div>
              {/* Simple Toggle pour la démo */}
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`w-12 h-6 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-indigo-500' : 'bg-slate-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </button>
            </div>
          </div>
        </section>

        {/* Section Audio */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Notifications</h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <Volume2 className="w-5 h-5" />
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Alertes Sonores</span>
              </div>
              <button className="w-12 h-6 rounded-full bg-indigo-500 relative transition-colors">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 translate-x-6"></div>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
