"use client"
import { Sun, ChevronRight, Sparkles } from "lucide-react"
import { format } from "date-fns"
import { useProgramStore } from "@/store/useProgramStore"
import { useSettingsStore } from "@/store/useSettingsStore"
import { useTranslation } from "@/lib/i18n"

interface MorningSummaryCardProps {
  onDismiss: () => void
}

export function MorningSummaryCard({ onDismiss }: MorningSummaryCardProps) {
  const settings = useSettingsStore((s) => s.settings)
  const t = useTranslation(settings.language)
  const programs = useProgramStore((s) => s.programs)

  const today = new Date()

  // Programmes du jour uniquement
  const todayPrograms = programs.filter((p) => {
    const pDate = new Date(p.startTime)
    return (
      pDate.getFullYear() === today.getFullYear() &&
      pDate.getMonth() === today.getMonth() &&
      pDate.getDate() === today.getDate() &&
      (p.status === "EN_ATTENTE" || p.status === "EN_COURS")
    )
  }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  const highPriority = todayPrograms.filter((p) => p.priority === "HAUTE")
  const firstTask = todayPrograms[0]

  // Salutation selon le ton et la langue
  const userName = settings.title ? `${settings.title}.` : ""
  const greetingKey = settings.tone === "FEMININ" ? "morning_greeting_f" : "morning_greeting_m"
  const greeting = t(greetingKey as any) || t("morning_greeting_m" as any) || "Bonjour"

  return (
    <div className="mx-auto w-full max-w-lg mb-4 animate-in slide-in-from-top duration-500">
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-yellow-950/30 border border-amber-200 dark:border-amber-800/50 rounded-3xl p-5 shadow-lg shadow-amber-100/50 dark:shadow-amber-950/20">
        
        {/* Décoration de fond */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-300/20 to-orange-300/10 rounded-full -translate-y-6 translate-x-6 blur-xl" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-yellow-300/15 to-transparent rounded-full translate-y-4 -translate-x-4 blur-lg" />

        <div className="relative z-10">
          {/* En-tête */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-md shadow-amber-300/40">
                <Sun className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
                  {t("morning_reminder")}
                </p>
                <p className="text-xs text-amber-800/70 dark:text-amber-300/60 font-semibold">
                  {format(today, "HH:mm")} · {t("today")}
                </p>
              </div>
            </div>
            <button
              onClick={onDismiss}
              className="text-amber-600/60 dark:text-amber-400/50 hover:text-amber-700 dark:hover:text-amber-300 text-[10px] font-bold uppercase tracking-wider transition-colors px-1"
            >
              {t("skip")}
            </button>
          </div>

          {/* Salutation personnalisée */}
          <h2 className="text-base font-black text-amber-900 dark:text-amber-100 mb-1 leading-snug">
            {greeting}{userName ? ` ${userName}` : ""} 
            {todayPrograms.length > 0
              ? ` ${t("morning_you_have")} ${todayPrograms.length} ${t("morning_tasks_today")}`
              : ` ${t("morning_no_tasks")}`
            }
          </h2>

          {/* Statistiques du jour */}
          {todayPrograms.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="bg-white/70 dark:bg-slate-900/40 border border-amber-100 dark:border-amber-800/30 rounded-2xl px-3 py-2.5 text-center">
                <div className="text-xl font-black text-amber-700 dark:text-amber-300">{todayPrograms.length}</div>
                <div className="text-[9px] font-bold text-amber-700/70 dark:text-amber-400/70 uppercase tracking-wider">{t("morning_total_tasks")}</div>
              </div>
              <div className="bg-white/70 dark:bg-slate-900/40 border border-red-100 dark:border-red-900/30 rounded-2xl px-3 py-2.5 text-center">
                <div className="text-xl font-black text-red-600 dark:text-red-400">{highPriority.length}</div>
                <div className="text-[9px] font-bold text-red-600/70 dark:text-red-400/70 uppercase tracking-wider">{t("priority_HAUTE")}</div>
              </div>
            </div>
          )}

          {/* Première tâche à venir */}
          {firstTask && (
            <div className="mt-3 bg-white/80 dark:bg-slate-900/50 border border-amber-100 dark:border-amber-800/30 rounded-2xl px-3 py-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  {t("morning_first_task")}
                </span>
              </div>
              <p className="font-bold text-sm text-slate-900 dark:text-white leading-snug truncate">{firstTask.title}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                {format(new Date(firstTask.startTime), "HH:mm")} – {format(new Date(firstTask.endTime), "HH:mm")}
                {firstTask.location ? ` · ${firstTask.location}` : ""}
              </p>
            </div>
          )}

          {/* Bouton d'action */}
          <button
            onClick={onDismiss}
            className="mt-3 w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-2xl font-black text-sm active:scale-95 transition-all shadow-md shadow-amber-400/30"
          >
            {t("morning_lets_go")}
            <ChevronRight className="w-4 h-4 stroke-[3px]" />
          </button>
        </div>
      </div>
    </div>
  )
}
