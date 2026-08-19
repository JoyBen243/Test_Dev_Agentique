"use client"
import { 
  Watch, 
  Plus, 
  CheckCircle2, 
  Circle, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  RotateCcw,
  Ban,
  Trash2,
  MapPin,
  AlignLeft,
  Clock
} from "lucide-react"
import { useState, useEffect } from "react"
import { format, isSameDay, addDays, subDays } from "date-fns"
import { fr } from "date-fns/locale"
import { CreateProgramDrawer } from "@/components/CreateProgramDrawer"
import { PostponeProgramDrawer } from "@/components/PostponeProgramDrawer"
import { useProgramStore } from "@/store/useProgramStore"

export default function DashboardPage() {
  const [now, setNow] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  
  const programs = useProgramStore((state) => state.programs)
  const refreshStatuses = useProgramStore((state) => state.refreshStatuses)
  const markAsDone = useProgramStore((state) => state.markAsDone)
  const abandonProgram = useProgramStore((state) => state.abandonProgram)
  const deleteProgram = useProgramStore((state) => state.deleteProgram)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setNow(new Date())
      refreshStatuses() // Recalcule les statuts en temps réel !
    }, 1000)
    return () => clearInterval(interval)
  }, [refreshStatuses])

  const isToday = isSameDay(selectedDate, now)

  // Filtrer les programmes de la date sélectionnée
  const filteredPrograms = programs.filter(p => {
    const pDate = new Date(p.startTime)
    return isSameDay(pDate, selectedDate)
  })

  // Trier chronologiquement par heure de début
  filteredPrograms.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  // Navigation dans les dates
  const handlePrevDay = () => setSelectedDate(prev => subDays(prev, 1))
  const handleNextDay = () => setSelectedDate(prev => addDays(prev, 1))
  const handleToday = () => setSelectedDate(new Date())

  return (
    <div className="flex flex-col min-h-full p-4 sm:p-6 pb-24">
      
      {/* En-tête avec Horloge en direct */}
      <header className="flex items-center justify-between mb-4 mt-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isToday ? "Aujourd'hui" : format(selectedDate, "EEEE d MMMM", { locale: fr })}
            </h1>
          </div>
          {mounted ? (
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-slate-500 dark:text-slate-400 font-medium capitalize text-xs sm:text-sm">
                {format(now, "EEEE d MMMM", { locale: fr })}
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

      {/* Barre de navigation Temporelle (Sélecteur de Date) */}
      <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 p-2 rounded-2xl mb-6 border border-slate-200 dark:border-slate-800">
        <button
          onClick={handlePrevDay}
          className="p-2 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl transition-all active:scale-95 shadow-sm"
          title="Jour précédent"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {/* Sélecteur de date natif */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-xl cursor-pointer hover:border-indigo-500 border border-transparent transition-all shadow-sm">
            <CalendarIcon className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold capitalize text-slate-800 dark:text-slate-200">
              {format(selectedDate, "dd MMM yyyy", { locale: fr })}
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
              Aujourd'hui
            </button>
          )}
        </div>

        <button
          onClick={handleNextDay}
          className="p-2 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl transition-all active:scale-95 shadow-sm"
          title="Jour suivant"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Rendu Conditionnel : État Vide ou Liste Interactive */}
      {filteredPrograms.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center mt-6 space-y-5">
          <div className="w-32 h-32 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center shadow-inner relative">
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-10 rounded-full"></div>
            <Watch className="w-16 h-16 text-slate-400 dark:text-slate-500 relative z-10" strokeWidth={1} />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              {isToday ? "Aucun programme aujourd'hui" : "Aucun programme pour cette date"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-[260px] mx-auto leading-relaxed">
              {isToday 
                ? "Il n'y a pas de programme prévu pour aujourd'hui, veuillez en ajouter si besoin."
                : `Rien n'est encore planifié pour le ${format(selectedDate, "d MMMM yyyy", { locale: fr })}.`}
            </p>
          </div>
          
          <CreateProgramDrawer trigger={
            <button className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-sm sm:text-base transition-all active:scale-95 shadow-xl shadow-slate-900/20 dark:shadow-white/10 mt-2">
              <Plus className="w-5 h-5" />
              Nouveau Programme
            </button>
          } />
        </div>
      ) : (
        <div className="flex-1 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Tâches prévues <span className="text-slate-400 font-medium">({filteredPrograms.length})</span>
            </h2>
            
            <CreateProgramDrawer trigger={
              <button className="p-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl active:scale-95 transition-all">
                <Plus className="w-5 h-5" />
              </button>
            } />
          </div>

          <div className="space-y-3.5">
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
                  
                  {/* Ligne Titre & Statut */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 flex-1">
                      {/* Icône de Statut interactive */}
                      <button
                        onClick={() => !isDone && markAsDone(program.id)}
                        disabled={isDone || isAbandoned || isPostponed}
                        className="mt-0.5 transition-transform active:scale-90"
                        title={isDone ? "Tâche validée" : "Cliquer pour marquer comme fait"}
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

                    {/* Badge Statut */}
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      isOngoing ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 animate-pulse' :
                      isDone ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' :
                      isObservation ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                      isPostponed ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' :
                      isAbandoned ? 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {program.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Horaires & Infos */}
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
                      <span className="text-red-500 text-[11px] font-bold">🔥 Haute</span>
                    )}

                    {program.originalId && (
                      <span className="text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                        (Reportée)
                      </span>
                    )}
                  </div>

                  {/* Barre d'Actions Interactives (Option 3) */}
                  {!isDone && !isAbandoned && (
                    <div className="flex items-center justify-end gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                      {/* Marquer Fait */}
                      <button
                        onClick={() => markAsDone(program.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold transition-all active:scale-95"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Fait
                      </button>

                      {/* Reporter */}
                      <PostponeProgramDrawer program={program} />

                      {/* Abandonner */}
                      <button
                        onClick={() => {
                          if (confirm("Voulez-vous vraiment marquer cette tâche comme abandonnée ?")) {
                            abandonProgram(program.id)
                          }
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-950/40 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 rounded-lg text-xs font-bold transition-all active:scale-95"
                        title="Abandonner la tâche"
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>

                      {/* Supprimer */}
                      <button
                        onClick={() => {
                          if (confirm("Supprimer définitivement ce programme ?")) {
                            deleteProgram(program.id)
                          }
                        }}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}

