"use client"
import * as React from "react"
import { Drawer } from "vaul"
import { Edit, X, MapPin, AlignLeft, Clock, AlertTriangle, Calendar, CheckCircle2 } from "lucide-react"
import { useProgramStore, Program } from "@/store/useProgramStore"
import { useSettingsStore } from "@/store/useSettingsStore"
import { useTranslation, formatStatusTitleCase } from "@/lib/i18n"

export function EditProgramDrawer({
  program,
  trigger,
}: {
  program: Program
  trigger?: React.ReactNode
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const updateProgram = useProgramStore((state) => state.updateProgram)
  const refreshStatuses = useProgramStore((state) => state.refreshStatuses)
  const language = useSettingsStore((state) => state.settings.language)
  const t = useTranslation(language)

  const startD = new Date(program.startTime)
  const endD = new Date(program.endTime)

  const yyyyStart = startD.getFullYear()
  const mmStart = String(startD.getMonth() + 1).padStart(2, '0')
  const ddStart = String(startD.getDate()).padStart(2, '0')
  const startDateStr = `${yyyyStart}-${mmStart}-${ddStart}`

  const startHours = String(startD.getHours()).padStart(2, '0')
  const startMinutes = String(startD.getMinutes()).padStart(2, '0')
  const startTimeStr = `${startHours}:${startMinutes}`

  const yyyyEnd = endD.getFullYear()
  const mmEnd = String(endD.getMonth() + 1).padStart(2, '0')
  const ddEnd = String(endD.getDate()).padStart(2, '0')
  const endDateStr = `${yyyyEnd}-${mmEnd}-${ddEnd}`

  const endHours = String(endD.getHours()).padStart(2, '0')
  const endMinutes = String(endD.getMinutes()).padStart(2, '0')
  const endTimeStr = `${endHours}:${endMinutes}`

  const [title, setTitle] = React.useState(program.title)
  const [startDate, setStartDate] = React.useState(startDateStr)
  const [startTime, setStartTime] = React.useState(startTimeStr)
  const [endDate, setEndDate] = React.useState(endDateStr)
  const [endTime, setEndTime] = React.useState(endTimeStr)
  const [location, setLocation] = React.useState(program.location || '')
  const [description, setDescription] = React.useState(program.description || '')
  const [priority, setPriority] = React.useState(program.priority)
  const [status, setStatus] = React.useState(program.status)

  // Réinitialiser les champs quand le tiroir s'ouvre
  React.useEffect(() => {
    if (isOpen) {
      setTitle(program.title)
      setStartDate(startDateStr)
      setStartTime(startTimeStr)
      setEndDate(endDateStr)
      setEndTime(endTimeStr)
      setLocation(program.location || '')
      setDescription(program.description || '')
      setPriority(program.priority)
      setStatus(program.status)
    }
  }, [isOpen, program])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newStart = new Date(`${startDate}T${startTime}`)
    const newEnd = new Date(`${endDate}T${endTime}`)

    const finalStart = isNaN(newStart.getTime()) ? new Date(program.startTime) : newStart
    const finalEnd = isNaN(newEnd.getTime()) ? new Date(program.endTime) : newEnd

    updateProgram(program.id, {
      title,
      startTime: finalStart,
      endTime: finalEnd,
      location: location || null,
      description: description || null,
      priority,
      status,
      updatedAt: new Date().toISOString(),
    })

    refreshStatuses()
    setIsOpen(false)
  }

  const getStatusLabel = (st: string) => {
    const key = `status_${st}` as Parameters<typeof t>[0]
    return formatStatusTitleCase(t(key) || st)
  }

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Trigger asChild>
        {trigger || (
          <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-lg transition-colors" title={t("edit")}>
            <Edit className="w-4 h-4" />
          </button>
        )}
      </Drawer.Trigger>
      
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />
        <Drawer.Content className="bg-slate-50 dark:bg-slate-950 flex flex-col rounded-t-[2rem] h-auto max-h-[90vh] fixed bottom-0 left-0 right-0 mx-auto max-w-md w-full z-50 focus:outline-none ring-0 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-t-[2rem] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 mb-3" />
            
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{t("edit_program")}</h2>
              <Drawer.Close asChild>
                <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
              </Drawer.Close>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-1 space-y-4 custom-scrollbar pb-6">
              {/* Titre */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Titre</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Statut modifiable (Crucial !) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t("filter_status")}</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {['EN_ATTENTE', 'EN_COURS', 'EN_OBSERVATION', 'FAIT', 'REPORTE', 'ABANDONNE'].map((st) => (
                    <option key={st} value={st}>
                      {getStatusLabel(st)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates & Heures */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Date début
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" /> {t("start_time")}
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Date fin
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" /> {t("end_time")}
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Lieu */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t("location")}</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t("description")}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Priorité */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t("filter_priority")}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'BASSE', label: t("priority_BASSE") },
                    { id: 'MOYENNE', label: t("priority_MOYENNE") },
                    { id: 'HAUTE', label: t("priority_HAUTE") },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPriority(p.id)}
                      className={`py-2 px-2 text-center rounded-xl text-xs font-bold transition-all border ${
                        priority === p.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-base transition-all active:scale-95 shadow-lg shadow-indigo-600/30"
                >
                  {t("save")}
                </button>
              </div>
            </form>

          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
