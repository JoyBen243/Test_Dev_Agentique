"use client"
import { Watch, Plus, CheckCircle2, Circle } from "lucide-react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CreateProgramDrawer } from "@/components/CreateProgramDrawer"
import { useProgramStore } from "@/store/useProgramStore"

export default function DashboardPage() {
  const [now, setNow] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  
  const programs = useProgramStore((state) => state.programs)
  const refreshStatuses = useProgramStore((state) => state.refreshStatuses)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setNow(new Date())
      refreshStatuses() // Recalcule les statuts chaque seconde !
    }, 1000)
    return () => clearInterval(interval)
  }, [refreshStatuses])

  // Filtrer les programmes d'aujourd'hui
  const todayPrograms = programs.filter(p => {
    const pDate = new Date(p.startTime)
    const tDate = new Date()
    return pDate.getDate() === tDate.getDate() && 
           pDate.getMonth() === tDate.getMonth() && 
           pDate.getFullYear() === tDate.getFullYear()
  })

  // Trier chronologiquement
  todayPrograms.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  return (
    <div className="flex flex-col min-h-full p-6 pb-24">
      {/* En-tête avec horloge */}
      <header className="flex items-center justify-between mb-8 mt-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Aujourd'hui</h1>
          {mounted ? (
            <>
              <p className="text-slate-500 dark:text-slate-400 font-medium capitalize">
                {format(now, "EEEE d MMMM", { locale: fr })}
              </p>
              <p className="text-indigo-600 dark:text-indigo-400 font-black text-2xl mt-1 tracking-wider tabular-nums">
                {format(now, "HH:mm:ss")}
              </p>
            </>
          ) : (
            <div className="h-12 flex items-center">
              <div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
            </div>
          )}
        </div>
        <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl shadow-sm">
          <Watch className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        </div>
      </header>

      {/* Rendu Conditionnel : Empty State ou Liste */}
      {todayPrograms.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center mt-10 space-y-6">
          <div className="w-40 h-40 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center shadow-inner relative">
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-10 rounded-full"></div>
            <Watch className="w-24 h-24 text-slate-400 dark:text-slate-500 relative z-10" strokeWidth={1} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
              Aucun programme
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[250px] mx-auto leading-relaxed">
              Il n'y a pas de programme prévu pour aujourd'hui, veuillez en ajouter si besoin.
            </p>
          </div>
          
          <CreateProgramDrawer trigger={
            <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-lg transition-all active:scale-95 shadow-xl shadow-slate-900/20 dark:shadow-white/10 mt-4">
              <Plus className="w-6 h-6" />
              Nouveau Programme
            </button>
          } />
        </div>
      ) : (
        <div className="mt-4 flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Vos Tâches <span className="text-slate-400 font-medium">({todayPrograms.length})</span>
            </h2>
            
            <CreateProgramDrawer trigger={
              <button className="p-2.5 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl active:scale-95 transition-all">
                <Plus className="w-5 h-5" />
              </button>
            } />
          </div>

          <div className="space-y-4">
            {todayPrograms.map(program => (
              <div key={program.id} className="group bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-slate-800 flex gap-4 transition-all hover:shadow-md">
                
                {/* Timeline / Status dot */}
                <div className="flex flex-col items-center justify-center pt-0.5">
                  {program.status === 'FAIT' ? (
                    <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                  ) : program.status === 'EN_COURS' ? (
                    <div className="w-7 h-7 rounded-full border-[5px] border-indigo-500 border-t-transparent animate-spin" />
                  ) : (
                    <Circle className="w-7 h-7 text-slate-300 dark:text-slate-700" />
                  )}
                </div>
                
                {/* Informations du programme */}
                <div className="flex-1">
                  <h3 className={`font-black text-lg leading-tight ${program.status === 'FAIT' ? 'line-through text-slate-400 dark:text-slate-600' : 'text-slate-900 dark:text-white'}`}>
                    {program.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                      <span>{format(new Date(program.startTime), 'HH:mm')}</span>
                      <span>-</span>
                      <span>{format(new Date(program.endTime), 'HH:mm')}</span>
                    </div>
                    
                    {/* Badge Statut */}
                    <span className={`px-2 py-1 rounded-md uppercase tracking-wider ${
                      program.status === 'EN_COURS' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' :
                      program.status === 'EN_ATTENTE' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' :
                      program.status === 'FAIT' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' :
                      program.status === 'EN_OBSERVATION' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                    }`}>
                      {program.status.replace('_', ' ')}
                    </span>
                    
                    {/* Indicateur de Priorité */}
                    {program.priority === 'HAUTE' && program.status !== 'FAIT' && (
                      <span className="text-red-500 animate-pulse">🔥 Haute prio</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
