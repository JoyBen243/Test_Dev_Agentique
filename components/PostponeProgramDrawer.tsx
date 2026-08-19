"use client"
import * as React from "react"
import { Drawer } from "vaul"
import { Clock, Calendar, X, RotateCcw } from "lucide-react"
import { useProgramStore, Program } from "@/store/useProgramStore"

export function PostponeProgramDrawer({
  program,
  trigger,
}: {
  program: Program
  trigger?: React.ReactNode
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const postponeProgram = useProgramStore((state) => state.postponeProgram)

  // Initialiser avec demain même heure par défaut
  const currentStart = new Date(program.startTime)
  const currentEnd = new Date(program.endTime)
  const durationMs = currentEnd.getTime() - currentStart.getTime()

  const tomorrow = new Date(currentStart.getTime() + 24 * 60 * 60 * 1000)
  const yyyy = tomorrow.getFullYear()
  const mm = String(tomorrow.getMonth() + 1).padStart(2, '0')
  const dd = String(tomorrow.getDate()).padStart(2, '0')
  const defaultDateStr = `${yyyy}-${mm}-${dd}`

  const startHours = String(currentStart.getHours()).padStart(2, '0')
  const startMinutes = String(currentStart.getMinutes()).padStart(2, '0')
  const defaultStartTimeStr = `${startHours}:${startMinutes}`

  const endHours = String(currentEnd.getHours()).padStart(2, '0')
  const endMinutes = String(currentEnd.getMinutes()).padStart(2, '0')
  const defaultEndTimeStr = `${endHours}:${endMinutes}`

  const [postponeDate, setPostponeDate] = React.useState(defaultDateStr)
  const [postponeStartTime, setPostponeStartTime] = React.useState(defaultStartTimeStr)
  const [postponeEndTime, setPostponeEndTime] = React.useState(defaultEndTimeStr)

  const handlePostpone = (e: React.FormEvent) => {
    e.preventDefault()

    const newStart = new Date(`${postponeDate}T${postponeStartTime}`)
    const newEnd = new Date(`${postponeDate}T${postponeEndTime}`)

    const finalStart = isNaN(newStart.getTime()) ? new Date(Date.now() + 86400000) : newStart
    const finalEnd = isNaN(newEnd.getTime()) ? new Date(finalStart.getTime() + durationMs) : newEnd

    postponeProgram(program.id, finalStart, finalEnd)
    setIsOpen(false)
  }

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Trigger asChild>
        {trigger || (
          <button className="flex items-center gap-1 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-bold transition-all active:scale-95">
            <RotateCcw className="w-3.5 h-3.5" /> Reporter
          </button>
        )}
      </Drawer.Trigger>
      
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />
        <Drawer.Content className="bg-slate-50 dark:bg-slate-950 flex flex-col rounded-t-[2rem] h-auto max-h-[85vh] fixed bottom-0 left-0 right-0 mx-auto max-w-md w-full z-50 focus:outline-none ring-0 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-t-[2rem] flex flex-col shadow-2xl">
            
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 mb-4" />
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Reporter la tâche</h2>
                <p className="text-xs text-slate-500 font-medium truncate max-w-[260px]">{program.title}</p>
              </div>
              <Drawer.Close asChild>
                <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95">
                  <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
              </Drawer.Close>
            </div>

            <form onSubmit={handlePostpone} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Nouvelle date
                </label>
                <input
                  type="date"
                  value={postponeDate}
                  onChange={(e) => setPostponeDate(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" /> Heure de début
                  </label>
                  <input
                    type="time"
                    value={postponeStartTime}
                    onChange={(e) => setPostponeStartTime(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" /> Heure de fin
                  </label>
                  <input
                    type="time"
                    value={postponeEndTime}
                    onChange={(e) => setPostponeEndTime(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white rounded-xl font-black text-base transition-all active:scale-95 shadow-lg shadow-amber-600/20"
                >
                  Confirmer le report
                </button>
              </div>
            </form>

          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
