"use client"
import { 
  Watch, 
  Plus, 
  CheckCircle2, 
  Circle, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Ban,
  Trash2,
  MapPin,
  AlignLeft,
  Clock,
  LayoutGrid,
  List as ListIcon,
  Moon,
} from "lucide-react"
import { useState, useEffect } from "react"
import { format, isSameDay, addDays, subDays } from "date-fns"
import { CreateProgramDrawer } from "@/components/CreateProgramDrawer"
import { PostponeProgramDrawer } from "@/components/PostponeProgramDrawer"
import { EditProgramDrawer } from "@/components/EditProgramDrawer"
import { EveningReviewModal } from "@/components/EveningReviewModal"
import { MorningSummaryCard } from "@/components/MorningSummaryCard"
import { useProgramStore } from "@/store/useProgramStore"
import { useSettingsStore } from "@/store/useSettingsStore"
import { useTranslation, formatStatusTitleCase, formatLanguageDate } from "@/lib/i18n"

export default function DashboardPage() {
  const settings = useSettingsStore((state) => state.settings)
  const t = useTranslation(settings.language)

  const [now, setNow] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const [viewMode, setViewMode] = useState<'GRILLE' | 'LISTE'>('LISTE')
  const [showEveningModal, setShowEveningModal] = useState(false)
  const [showMorningCard, setShowMorningCard] = useState(false)
  const [morningDismissed, setMorningDismissed] = useState(false)
  const [eveningTriggered, setEveningTriggered] = useState(false)
  
  const programs = useProgramStore((state) => state.programs)
  const refreshStatuses = useProgramStore((state) => state.refreshStatuses)
  const markAsDone = useProgramStore((state) => state.markAsDone)
  const abandonProgram = useProgramStore((state) => state.abandonProgram)
  const deleteProgram = useProgramStore((state) => state.deleteProgram)

  // Synchroniser le mode de vue avec le paramètre utilisateur
  useEffect(() => {
    if (settings.viewType === 'LISTE' || settings.viewType === 'GRILLE') {
      setViewMode(settings.viewType as 'GRILLE' | 'LISTE')
    }
  }, [settings.viewType])

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      const currentTime = new Date()
      setNow(currentTime)
      refreshStatuses()

      const hours = currentTime.getHours()
      const minutes = currentTime.getMinutes()

      // ☀️ Rappel du matin : entre morningReminderTime et 7h30
      const [morningH, morningM] = (settings.morningReminderTime || "05:15").split(":").map(Number)
      const isMorningWindow =
        (hours > morningH || (hours === morningH && minutes >= morningM)) &&
        (hours < 7 || (hours === 7 && minutes <= 30))
      if (isMorningWindow && !morningDismissed) {
        setShowMorningCard(true)
      } else if (!isMorningWindow) {
        setShowMorningCard(false)
      }

      // 🌙 Bilan du soir : à partir de eveningSummaryTime
      const [eveningH, eveningM] = (settings.eveningSummaryTime || "19:30").split(":").map(Number)
      const isEveningTime =
        hours > eveningH || (hours === eveningH && minutes >= eveningM)
      if (isEveningTime && !eveningTriggered) {
        // Vérifier s'il y a des tâches non clôturées du jour
        const today = new Date()
        const hasPending = programs.some((p) => {
          const pDate = new Date(p.startTime)
          return (
            pDate.getFullYear() === today.getFullYear() &&
            pDate.getMonth() === today.getMonth() &&
            pDate.getDate() === today.getDate() &&
            (p.status === "EN_OBSERVATION" || p.status === "EN_COURS" || p.status === "EN_ATTENTE")
          )
        })
        if (hasPending) {
          setEveningTriggered(true)
          setShowEveningModal(true)
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [refreshStatuses, morningDismissed, eveningTriggered, programs, settings.morningReminderTime, settings.eveningSummaryTime])

  const isToday = isSameDay(selectedDate, now)

  const filteredPrograms = programs.filter(p => {
    const pDate = new Date(p.startTime)
    return isSameDay(pDate, selectedDate)
  })

  filteredPrograms.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  // Heures actives uniques qui ont des tâches prévues
  const activeHours = Array.from(new Set(filteredPrograms.map(p => new Date(p.startTime).getHours()))).sort((a, b) => a - b)

  const handlePrevDay = () => setSelectedDate(prev => subDays(prev, 1))
  const handleNextDay = () => setSelectedDate(prev => addDays(prev, 1))
  const handleToday = () => setSelectedDate(new Date())

  const getStatusLabel = (status: string) => {
    const key = `status_${status}` as Parameters<typeof t>[0]
    return formatStatusTitleCase(t(key) || status)
  }

  return (
    <div className="flex flex-col min-h-full p-4 sm:p-6 pb-24 max-w-lg mx-auto w-full">
      
      {/* 🌙 Bilan du Soir (Modal Overlay) */}
      <EveningReviewModal
        isOpen={showEveningModal}
        onClose={() => setShowEveningModal(false)}
      />

      {/* ☀️ Rappel du Matin (Bannière) */}
      {showMorningCard && (
        <MorningSummaryCard onDismiss={() => { setShowMorningCard(false); setMorningDismissed(true) }} />
      )}

      {/* En-tête avec Horloge en direct */}
      <header className="flex items-center justify-between mb-4 mt-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white capitalize">
              {isToday ? t("today") : formatLanguageDate(selectedDate, settings.language)}
            </h1>
          </div>
          {mounted ? (
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-slate-500 dark:text-slate-400 font-medium capitalize text-xs sm:text-sm">
                {formatLanguageDate(now, settings.language)}
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-black text-xs sm:text-sm tracking-wider tabular-nums bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                {format(now, "HH:mm:ss")}
              </span>
            </div>
          ) : (
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mt-1" />
          )}
        </div>

        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl shadow-sm">
          <Watch className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
      </header>

      {/* Barre de navigation Temporelle & Toggle Mode Grille/Liste */}
      <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 p-2 rounded-2xl mb-5 border border-slate-200 dark:border-slate-800">
        <button
          onClick={handlePrevDay}
          className="p-2 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl transition-all active:scale-95 shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-xl cursor-pointer hover:border-indigo-500 border border-transparent transition-all shadow-sm">
            <CalendarIcon className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold capitalize text-slate-800 dark:text-slate-200">
              {format(selectedDate, "dd MMM yyyy")}
            </span>
            <input
              type="date"
              className="sr-only"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={(e) => {
                if (e.target.value) {
                  const [y, m, d] = e.target.value.split('-').map(Number)
                  setSelectedDate(new Date(y, m - 1, d))
                }
              }}
            />
          </label>

          {!isToday && (
            <button
              onClick={handleToday}
              className="px-2.5 py-1.5 bg-indigo-600 text-white rounded-xl text-[11px] font-bold hover:bg-indigo-500 transition-all active:scale-95 shadow-md shadow-indigo-600/20"
            >
              {t("today")}
            </button>
          )}
        </div>

        <button
          onClick={handleNextDay}
          className="p-2 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl transition-all active:scale-95 shadow-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* En-tête des Tâches & Commutateur de Mode (Grille/Liste) sur Dashboard */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t("planned_tasks")} <span className="text-slate-400 font-medium">({filteredPrograms.length})</span>
          </h2>

          {/* Bouton manuel Bilan du Soir (visible uniquement aujourd'hui si des tâches sont non clôturées) */}
          {isToday && filteredPrograms.some(p => ['EN_OBSERVATION', 'EN_COURS', 'EN_ATTENTE'].includes(p.status)) && (
            <button
              onClick={() => setShowEveningModal(true)}
              className="flex items-center gap-1 px-2 py-1 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800/50 rounded-lg text-indigo-600 dark:text-indigo-400 transition-all active:scale-95"
              title={t("evening_summary")}
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold hidden sm:inline">{t("evening_summary")}</span>
            </button>
          )}
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setViewMode('GRILLE')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'GRILLE'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> {t("view_grid")}
          </button>

          <button
            onClick={() => setViewMode('LISTE')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'LISTE'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ListIcon className="w-3.5 h-3.5" /> {t("view_list")}
          </button>
        </div>
      </div>

      {/* Rendu Conditionnel si aucun programme */}
      {filteredPrograms.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center mt-6 space-y-5">
          <div className="w-32 h-32 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center shadow-inner relative">
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-10 rounded-full"></div>
            <Watch className="w-16 h-16 text-slate-400 dark:text-slate-500 relative z-10" strokeWidth={1} />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              {t("no_programs_title")}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-[260px] mx-auto leading-relaxed">
              {isToday ? t("no_programs_today") : t("no_programs_date")}
            </p>
          </div>
          
          <CreateProgramDrawer trigger={
            <button className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-sm sm:text-base transition-all active:scale-95 shadow-xl shadow-slate-900/20 dark:shadow-white/10 mt-2">
              <Plus className="w-5 h-5" />
              {t("new_program")}
            </button>
          } />
        </div>
      ) : (
        <>
          {/* MODE GRILLE COMPACTE (Ne montre QUE les heures qui ont des programmes) */}
          {viewMode === 'GRILLE' ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-4">
                {activeHours.map((hour) => {
                  const hourStr = String(hour).padStart(2, '0') + ':00'
                  const matchingPrograms = filteredPrograms.filter(p => new Date(p.startTime).getHours() === hour)

                  return (
                    <div key={hour} className="flex gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80 last:border-0 last:pb-0">
                      <div className="w-14 text-xs font-black text-indigo-600 dark:text-indigo-400 tabular-nums pt-1 border-r border-slate-100 dark:border-slate-800/60 pr-2 flex items-start justify-end">
                        {hourStr}
                      </div>

                      <div className="flex-1 space-y-2.5">
                        {matchingPrograms.map((prog) => {
                          const isDone = prog.status === 'FAIT'
                          const isOngoing = prog.status === 'EN_COURS'
                          const isObservation = prog.status === 'EN_OBSERVATION'

                          return (
                            <div
                              key={prog.id}
                              className={`p-3.5 rounded-2xl border transition-all shadow-sm ${
                                isDone
                                  ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                                  : isOngoing
                                  ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 text-slate-900 dark:text-white font-bold ring-2 ring-indigo-500/20'
                                  : isObservation
                                  ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200'
                                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="font-bold text-xs sm:text-sm">{prog.title}</span>
                                <span className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded-md ${
                                  isOngoing ? 'bg-indigo-600 text-white' :
                                  isDone ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' :
                                  isObservation ? 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300' :
                                  'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                }`}>
                                  {getStatusLabel(prog.status)}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-700/50">
                                <div className="flex items-center gap-1 font-semibold">
                                  <Clock className="w-3 h-3 text-indigo-500" />
                                  <span>{format(new Date(prog.startTime), 'HH:mm')} - {format(new Date(prog.endTime), 'HH:mm')}</span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  {!isDone && prog.status !== 'ABANDONNE' && (
                                    <button
                                      onClick={() => markAsDone(prog.id)}
                                      className="p-1 hover:bg-emerald-50 rounded text-emerald-600 transition-colors"
                                      title={t("action_mark_done")}
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                  )}
                                  <PostponeProgramDrawer program={prog} />
                                  <EditProgramDrawer program={prog} />
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            /* MODE LISTE */
            <div className="space-y-3.5 animate-in fade-in duration-300">
              {filteredPrograms.map(program => {
                const isDone = program.status === 'FAIT'
                const isOngoing = program.status === 'EN_COURS'
                const isObservation = program.status === 'EN_OBSERVATION'
                const isPostponed = program.status === 'REPORTE'
                const isAbandoned = program.status === 'ABANDONNE'

                return (
                  <div 
                    key={program.id} 
                    className={`p-4 rounded-2xl border transition-all shadow-sm ${
                      isDone
                        ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800/60 opacity-80'
                        : isOngoing
                        ? 'bg-white dark:bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/20 shadow-indigo-500/5'
                        : isObservation
                        ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/50'
                        : isAbandoned
                        ? 'bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 opacity-60'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 flex-1">
                        <button
                          onClick={() => !isDone && markAsDone(program.id)}
                          disabled={isDone || isAbandoned || isPostponed}
                          className="mt-0.5 transition-transform active:scale-90"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          ) : isOngoing ? (
                            <div className="w-6 h-6 rounded-full border-[3px] border-indigo-500 border-t-transparent animate-spin" />
                          ) : isObservation ? (
                            <Circle className="w-6 h-6 text-red-500 fill-red-100 dark:fill-red-950" />
                          ) : (
                            <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600 hover:text-emerald-500" />
                          )}
                        </button>

                        <div className="flex-1">
                          <h3 className={`font-bold text-base leading-snug ${isDone || isAbandoned ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                            {program.title}
                          </h3>

                          {program.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 line-clamp-2">
                              <AlignLeft className="w-3 h-3 flex-shrink-0" />
                              {program.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black tracking-wider ${
                        isOngoing ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 animate-pulse' :
                        isDone ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' :
                        isObservation ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                        isPostponed ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' :
                        isAbandoned ? 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {getStatusLabel(program.status)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-[11px]">
                        <Clock className="w-3 h-3 text-indigo-500" />
                        <span>{format(new Date(program.startTime), 'HH:mm')}</span>
                        <span>-</span>
                        <span>{format(new Date(program.endTime), 'HH:mm')}</span>
                      </div>

                      {program.location && (
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-[11px]">
                          <MapPin className="w-3 h-3 text-indigo-500" />
                          <span className="truncate max-w-[120px]">{program.location}</span>
                        </div>
                      )}

                      {program.priority === 'HAUTE' && !isDone && (
                        <span className="text-red-500 text-[11px] font-bold">{t("priority_high_badge")}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                      {!isDone && !isAbandoned && (
                        <button
                          onClick={() => markAsDone(program.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold transition-all active:scale-95"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> {t("action_mark_done")}
                        </button>
                      )}

                      {!isDone && !isAbandoned && (
                        <PostponeProgramDrawer program={program} />
                      )}

                      {!isDone && !isAbandoned && (
                        <button
                          onClick={() => {
                            if (confirm(t("confirm_abandon"))) {
                              abandonProgram(program.id)
                            }
                          }}
                          className="flex items-center gap-1 px-2 py-1.5 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 text-slate-600 hover:text-red-600 rounded-lg text-xs font-bold transition-all active:scale-95"
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <EditProgramDrawer program={program} />

                      <button
                        onClick={() => {
                          if (confirm(t("confirm_delete"))) {
                            deleteProgram(program.id)
                          }
                        }}
                        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-40">
        <CreateProgramDrawer trigger={
          <button className="p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-2xl shadow-indigo-600/40 active:scale-90 transition-all flex items-center justify-center">
            <Plus className="w-6 h-6 stroke-[3px]" />
          </button>
        } />
      </div>

    </div>
  )
}
