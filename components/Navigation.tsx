"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Settings, ListTodo } from "lucide-react"

import { useSettingsStore } from "@/store/useSettingsStore"
import { useTranslation } from "@/lib/i18n"

export function Navigation() {
  const pathname = usePathname()
  const isOnboarded = useSettingsStore((state) => state.isOnboarded)
  const language = useSettingsStore((state) => state.settings.language)
  const t = useTranslation(language)
  
  // On masque la barre de navigation sur les pages d'accueil, d'onboarding, ou si l'onboarding n'est pas complété
  if (pathname === '/' || pathname === '/onboarding' || !isOnboarded) {
    return null
  }

  const navItems = [
    { name: t("nav_dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("nav_programmes"), href: "/programmes", icon: ListTodo },
    { name: t("nav_settings"), href: "/settings", icon: Settings },
  ]

  return (
    <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${
                isActive 
                  ? "text-indigo-600 dark:text-indigo-400" 
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {/* Effet visuel pour l'icône active */}
              {isActive && (
                <span className="absolute -top-1 w-8 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-b-full"></span>
              )}
              <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? "scale-110 stroke-[2.5px]" : "stroke-2"}`} />
              <span className="text-[10px] font-semibold tracking-wide">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
