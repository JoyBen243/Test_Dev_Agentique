"use client"
import { useState, useEffect } from "react"
import { 
  LayoutGrid, 
  List as ListIcon, 
  Search, 
  Plus, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Ban, 
  Trash2, 
  MapPin, 
  AlignLeft,
  Sparkles
} from "lucide-react"
import { format, isSameDay, addDays, subDays } from "date-fns"
import { useProgramStore, Program } from "@/store/useProgramStore"
import { useSettingsStore } from "@/store/useSettingsStore"
import { useTranslation, formatStatusTitleCase, formatLanguageDate } from "@/lib/i18n"
import { CreateProgramDrawer } from "@/components/CreateProgramDrawer"
import { PostponeProgramDrawer } from "@/components/PostponeProgramDrawer"
import { EditProgramDrawer } from "@/components/EditProgramDrawer"

export default function ProgrammesPage() {
  const settings = useSettingsStore((state) => state.settings)
  const t = useTranslation(settings.language)
  
  const [viewMode, setViewMode] = useState<'GRILLE' | 'LISTE'>('LISTE')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('TOUS')
  const [selectedPriority, setSelectedPriority] = useState<string>('TOUTES')

  const programs = useProgramStore((state) => state.programs)
  const refreshStatuses = useProgramStore((state) => state.refreshStatuses)
  const markAsDone = useProgramStore((state) => state.markAsDone)
  const abandonProgram = useProgramStore((state) => state.abandonProgram)
  const deleteProgram = useProgramStore((state) => state.deleteProgram)

  const [now, setNow] = useState(new Date())

  useEffect(() => {
    if (settings.viewType === 'LISTE' || settings.viewType === 'GRILLE') {
      setViewMode(settings.viewType as 'GRILLE' | 'LISTE')
    }
  }, [settings.viewType])

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
      refreshStatuses()
    }, 1000)
    return () => clearInterval(interval)
  }, [refreshStatuses])

  const filteredPrograms = programs.filter(p => {
    const matchesSearch = searchQuery === '' || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = selectedStatus === 'TOUS' || p.status === selectedStatus
    const matchesPriority = selectedPriority === 'TOUTES' || p.priority === selectedPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const gridPrograms = filteredPrograms.filter(p => isSameDay(new Date(p.startTime), selectedDate))
  gridPrograms.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  // Extrait uniquement les heures actives ayant des tâches (Évite les tranches vides inutilement longues)
  const activeHours = Array.from(new Set(gridPrograms.map(p => new Date(p.startTime).getHours()))).sort((a, b) => a - b)

  const handlePrevDay = () => setSelectedDate(prev => subDays(prev, 1))
  const handleNextDay = () => setSelectedDate(prev => addDays(prev, 1))
  const handleToday = () => setSelectedDate(new Date())

  const getStatusLabel = (status: string) => {
    const key = `status_${status}` as Parameters<typeof t>[0]
    return formatStatusTitleCase(t(key) || status)
  }

  return (
    <div className="flex flex-col min-h-full p-4 sm:p-6 pb-28 max-w-lg mx-auto w-full">
      
      {/* En-tête avec Commutateur de Vue */}
      <header className="flex items-center justify-between mb-5 mt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t("programs_title")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {programs.length} {t("total_tasks")}
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setViewMode('GRILLE')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'GRILLE'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> {t("view_grid")}
          </button>

          <button
            onClick={() => setViewMode('LISTE')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'LISTE'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ListIcon className="w-3.5 h-3.5" /> {t("view_list")}
          </button>
        </div>
      </header>

      {/* Recherche & Filtres */}
      <div className="space-y-3 mb-5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t("search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {[
            { id: 'TOUS', label: t("all") },
            { id: 'EN_ATTENTE', label: getStatusLabel('EN_ATTENTE') },
            { id: 'EN_COURS', label: getStatusLabel('EN_COURS') },
            { id: 'EN_OBSERVATION', label: getStatusLabel('EN_OBSERVATION') },
            { id: 'FAIT', label: getStatusLabel('FAIT') },
            { id: 'REPORTE', label: getStatusLabel('REPORTE') },
            { id: 'ABANDONNE', label: getStatusLabel('ABANDONNE') },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border ${
                selectedStatus === st.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rendu 1 : MODE GRILLE INTELLIGENTE (Masque les tranches d'heures vides) */}
      {viewMode === 'GRILLE' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={handlePrevDay}
              className="p-1.5 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-800 rounded-xl cursor-pointer shadow-sm">
                <CalendarIcon className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-xs font-bold capitalize text-slate-800 dark:text-slate-200">
                  {formatLanguageDate(selectedDate, settings.language)}
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

              {!isSameDay(selectedDate, new Date()) && (
                <button
                  onClick={handleToday}
                  className="px-2 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold"
                >
                  {t("today")}
                </button>
              )}
            </div>

            <button
              onClick={handleNextDay}
              className="p-1.5 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {gridPrograms.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Sparkles className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("no_programs_date")}</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3 sm:p-4 shadow-sm space-y-4">
              {activeHours.map((hour) => {
                const hourStr = String(hour).padStart(2, '0') + ':00'
                const matchingPrograms = gridPrograms.filter(p => new Date(p.startTime).getHours() === hour)

                return (
                  <div key={hour} className="flex gap-2 sm:gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80 last:border-0 last:pb-0">
                    <div className="w-11 sm:w-14 text-[11px] sm:text-xs font-black text-indigo-600 dark:text-indigo-400 tabular-nums pt-1 border-r border-slate-100 dark:border-slate-800/60 pr-1.5 sm:pr-2 flex items-start justify-end shrink-0">
                      {hourStr}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2.5">
                      {matchingPrograms.map((prog) => {
                        const isDone = prog.status === 'FAIT'
                        const isOngoing = prog.status === 'EN_COURS'
                        const isObservation = prog.status === 'EN_OBSERVATION'
                        const isFuture = new Date(prog.startTime) > now || prog.status === 'EN_ATTENTE'
                        const canMarkDone = !isDone && prog.status !== 'ABANDONNE' && !isFuture

                        return (
                          <div
                            key={prog.id}
                            className={`p-3 sm:p-3.5 rounded-2xl border transition-all shadow-sm ${
                              isDone
                                ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                                : isOngoing
                                ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 text-slate-900 dark:text-white font-bold ring-2 ring-indigo-500/20'
                                : isObservation
                                ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1.5 mb-1.5">
                              <span className="font-bold text-xs sm:text-sm truncate">{prog.title}</span>
                              <span className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded-md shrink-0 ${
                                isOngoing ? 'bg-indigo-600 text-white' :
                                isDone ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' :
                                isObservation ? 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300' :
                                'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                              }`}>
                                {getStatusLabel(prog.status)}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-y-1.5 gap-x-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-700/50">
                              <div className="flex items-center gap-1 font-semibold text-[10px] sm:text-[11px] shrink-0">
                                <Clock className="w-3 h-3 text-indigo-500" />
                                <span>{format(new Date(prog.startTime), 'HH:mm')} - {format(new Date(prog.endTime), 'HH:mm')}</span>
                              </div>

                              <div className="flex items-center gap-1 shrink-0 ml-auto">
                                {canMarkDone && (
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
                                <button
                                  onClick={() => {
                                    if (confirm(t("confirm_delete"))) {
                                      deleteProgram(prog.id)
                                    }
                                  }}
                                  className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors"
                                  title={t("delete")}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
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
          )}
        </div>
      )}

      {/* Rendu 2 : MODE LISTE */}
      {viewMode === 'LISTE' && (
        /* MODE LISTE */
        <div className="space-y-3.5 animate-in fade-in duration-300">
          {filteredPrograms.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Sparkles className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("no_matching_programs")}</p>
            </div>
          ) : (
            filteredPrograms.map(program => {
              const isDone = program.status === 'FAIT'
              const isOngoing = program.status === 'EN_COURS'
              const isObservation = program.status === 'EN_OBSERVATION'
              const isPostponed = program.status === 'REPORTE'
              const isAbandoned = program.status === 'ABANDONNE'
              const isFuture = new Date(program.startTime) > now || program.status === 'EN_ATTENTE'
              const canMarkDone = !isDone && !isAbandoned && !isPostponed && !isFuture

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
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <button
                        onClick={() => canMarkDone && markAsDone(program.id)}
                        disabled={!canMarkDone}
                        className={`mt-0.5 transition-transform ${canMarkDone ? 'active:scale-90' : 'cursor-default'}`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        ) : isOngoing ? (
                          <div className="w-6 h-6 rounded-full border-[3px] border-indigo-500 border-t-transparent animate-spin" />
                        ) : isObservation ? (
                          <Circle className="w-6 h-6 text-red-500 fill-red-100 dark:fill-red-950" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 capitalize mb-0.5">
                          {formatLanguageDate(new Date(program.startTime), settings.language)}
                        </div>
                        <h3 className={`font-bold text-base leading-snug truncate ${isDone || isAbandoned ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
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

                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black tracking-wider shrink-0 ${
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
                    {canMarkDone && (
                      <button
                        onClick={() => markAsDone(program.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold transition-all active:scale-95"
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
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 text-slate-600 hover:text-red-600 rounded-lg text-xs font-bold transition-all active:scale-95"
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
            })
          )}
        </div>
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
