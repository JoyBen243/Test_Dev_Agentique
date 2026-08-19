"use client"
import { useState } from "react"
import { format } from "date-fns"
import { Moon, Clock, MapPin, ChevronRight, CheckCircle2, X } from "lucide-react"
import { useProgramStore } from "@/store/useProgramStore"
import { useSettingsStore } from "@/store/useSettingsStore"
import { useTranslation, formatStatusTitleCase } from "@/lib/i18n"
import { PostponeProgramDrawer } from "@/components/PostponeProgramDrawer"

interface EveningReviewModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EveningReviewModal({ isOpen, onClose }: EveningReviewModalProps) {
  const settings = useSettingsStore((s) => s.settings)
  const t = useTranslation(settings.language)
  const programs = useProgramStore((s) => s.programs)
  const markAsDone = useProgramStore((s) => s.markAsDone)
  const abandonProgram = useProgramStore((s) => s.abandonProgram)

  const [closingId, setClosingId] = useState<string | null>(null)

  // Tâches de TODAY non clôturées : EN_OBSERVATION et EN_COURS uniquement
  const today = new Date()
  const pending = programs.filter((p) => {
    const pDate = new Date(p.startTime)
    return (
      pDate.getFullYear() === today.getFullYear() &&
      pDate.getMonth() === today.getMonth() &&
      pDate.getDate() === today.getDate() &&
      (p.status === "EN_OBSERVATION" || p.status === "EN_COURS" || p.status === "EN_ATTENTE")
    )
  }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  const done = programs.filter((p) => {
    const pDate = new Date(p.startTime)
    return (
      pDate.getFullYear() === today.getFullYear() &&
      pDate.getMonth() === today.getMonth() &&
      pDate.getDate() === today.getDate() &&
      p.status === "FAIT"
    )
  })

  const handleAbandon = (id: string) => {
    setClosingId(id)
    setTimeout(() => {
      abandonProgram(id)
      setClosingId(null)
    }, 300)
  }

  const handleMarkDone = (id: string) => {
    setClosingId(id)
    setTimeout(() => {
      markAsDone(id)
      setClosingId(null)
    }, 300)
  }

  if (!isOpen) return null

  const priorityLabel: Record<string, string> = {
    HAUTE: t("priority_HAUTE"),
    MOYENNE: t("priority_MOYENNE"),
    BASSE: t("priority_BASSE"),
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={t("evening_summary")}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Panel principal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-400 max-h-[90dvh] flex flex-col">
        
        {/* En-tête */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  {t("evening_summary")}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t("evening_summary_desc")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Résumé rapide */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl px-3 py-2.5 text-center">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{done.length}</div>
              <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">{t("status_FAIT")}</div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50 rounded-2xl px-3 py-2.5 text-center">
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{pending.length}</div>
              <div className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">{t("evening_pending")}</div>
            </div>
          </div>
        </div>

        {/* Corps scrollable */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-3">
          {pending.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("evening_all_done")}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("evening_all_done_desc")}</p>
            </div>
          ) : (
            <>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                {t("evening_pending_label")}
              </p>
              {pending.map((prog) => {
                const isClosing = closingId === prog.id
                return (
                  <div
                    key={prog.id}
                    className={`bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-all duration-300 ${
                      isClosing ? "opacity-0 translate-y-2 scale-95" : "opacity-100"
                    }`}
                  >
                    {/* Titre + Heure */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">{prog.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-indigo-400" />
                            {format(new Date(prog.startTime), "HH:mm")} – {format(new Date(prog.endTime), "HH:mm")}
                          </span>
                          {prog.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-indigo-400" />
                              <span className="truncate max-w-[80px]">{prog.location}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                        prog.priority === "HAUTE"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                          : prog.priority === "MOYENNE"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                          : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}>
                        {priorityLabel[prog.priority] || prog.priority}
                      </span>
                    </div>

                    {/* Boutons d'action rapide */}
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {/* Marquer Fait */}
                      <button
                        onClick={() => handleMarkDone(prog.id)}
                        className="flex flex-col items-center gap-1 py-2.5 px-2 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-emerald-700 dark:text-emerald-300 transition-all active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-[10px] font-bold">{t("action_mark_done")}</span>
                      </button>

                      {/* Reporter */}
                      <PostponeProgramDrawer
                        program={prog}
                        trigger={
                          <button className="flex flex-col items-center gap-1 py-2.5 px-2 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/50 rounded-xl text-amber-700 dark:text-amber-300 transition-all active:scale-95 w-full">
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-[10px] font-bold">{t("action_postpone")}</span>
                          </button>
                        }
                      />

                      {/* Abandonner */}
                      <button
                        onClick={() => handleAbandon(prog.id)}
                        className="flex flex-col items-center gap-1 py-2.5 px-2 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 transition-all active:scale-95"
                      >
                        <X className="w-4 h-4" />
                        <span className="text-[10px] font-bold">{t("action_abandon")}</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>

        {/* Pied de page */}
        <div className="px-5 pb-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm active:scale-95 transition-all"
          >
            {t("evening_close")}
          </button>
        </div>
      </div>
    </div>
  )
}
