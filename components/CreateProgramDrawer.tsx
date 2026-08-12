"use client"
import * as React from "react"
import { Drawer } from "vaul"
import { Plus, X, MapPin, AlignLeft, Clock, AlertTriangle, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { useProgramStore } from "@/store/useProgramStore"
import { useSettingsStore } from "@/store/useSettingsStore"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const programSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  startDate: z.string().min(1, "Requise"),
  startTime: z.string().min(1, "Requise"),
  endDate: z.string().min(1, "Requise"),
  endTime: z.string().min(1, "Requise"),
  location: z.string().optional(),
  description: z.string().optional(),
  priority: z.enum(["BASSE", "MOYENNE", "HAUTE"]),
})

type ProgramFormData = z.infer<typeof programSchema>

export function CreateProgramDrawer({
  trigger,
}: {
  trigger?: React.ReactNode
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const addProgram = useProgramStore((state) => state.addProgram)
  const refreshStatuses = useProgramStore((state) => state.refreshStatuses)

  // Valeurs par défaut séparées pour la date et l'heure
  const now = new Date()
  
  // Format local pour YYYY-MM-DD
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const currentDateStr = `${yyyy}-${mm}-${dd}`;
  
  // Format local pour HH:mm
  const currentHours = String(now.getHours()).padStart(2, '0');
  const currentMinutes = String(now.getMinutes()).padStart(2, '0');
  const currentTimeStr = `${currentHours}:${currentMinutes}`;

  const end = new Date(now.getTime() + 60 * 60 * 1000)
  const endHours = String(end.getHours()).padStart(2, '0');
  const endMinutes = String(end.getMinutes()).padStart(2, '0');
  const endTimeStr = `${endHours}:${endMinutes}`;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      priority: "MOYENNE",
      startDate: currentDateStr,
      startTime: currentTimeStr,
      endDate: currentDateStr,
      endTime: endTimeStr,
    }
  })

  const onSubmit = async (data: ProgramFormData) => {
    // Recombinaison de la date et de l'heure
    const parsedStart = new Date(`${data.startDate}T${data.startTime}`)
    const parsedEnd = new Date(`${data.endDate}T${data.endTime}`)

    const finalStart = isNaN(parsedStart.getTime()) ? new Date() : parsedStart
    const finalEnd = isNaN(parsedEnd.getTime()) ? new Date(new Date().getTime() + 3600000) : parsedEnd

    const newProgram = {
      id: crypto.randomUUID(),
      title: data.title,
      startTime: finalStart,
      endTime: finalEnd,
      location: data.location || null,
      description: data.description || null,
      priority: data.priority,
      status: "EN_ATTENTE", 
      originalId: null,
    }
    
    addProgram(newProgram)
    refreshStatuses()

    reset()
    setIsOpen(false)

    // Vérifier si l'utilisateur est en cours d'onboarding
    const { isOnboarded, setOnboardingStep } = useSettingsStore.getState()
    if (!isOnboarded) {
      setOnboardingStep('MANDATORY_SETTINGS')
      router.push('/settings?onboarding=true')
    }
  }

  return (
    <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Trigger asChild>
        {trigger || (
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold transition-all active:scale-95 shadow-md">
            <Plus className="w-5 h-5" />
            Nouveau Programme
          </button>
        )}
      </Drawer.Trigger>
      
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />
        {/* CORRECTION : max-h-[85vh] et h-auto pour s'adapter à l'écran et ne pas déborder en bas */}
        <Drawer.Content className="bg-slate-50 dark:bg-slate-950 flex flex-col rounded-t-[2rem] h-auto max-h-[85vh] mt-24 fixed bottom-0 left-0 right-0 mx-auto max-w-md w-full z-50 focus:outline-none ring-0 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-t-[2rem] flex-1 flex flex-col shadow-2xl overflow-hidden">
            
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 mb-4" />
            
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Nouveau Programme</h2>
              <Drawer.Close asChild>
                <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95">
                  <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
              </Drawer.Close>
            </div>

            {/* Formulaire avec overflow-y-auto sur cette partie spécifique pour que le bouton reste toujours visible */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-2 space-y-6 custom-scrollbar pb-6">
              
              <div className="space-y-1">
                <input 
                  {...register("title")}
                  placeholder="Que voulez-vous accomplir ?"
                  className="w-full text-lg font-bold bg-transparent border-b-2 border-slate-200 dark:border-slate-800 pb-2 focus:border-indigo-500 focus:outline-none placeholder-slate-400 dark:placeholder-slate-600 transition-colors"
                />
                {errors.title && <p className="text-red-500 text-xs font-medium mt-1">{errors.title.message}</p>}
              </div>

              {/* Dates et Heures */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1 space-y-1.5">
                    <label 
                      className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors"
                      onClick={() => {
                        const el = document.getElementById('startDate') as HTMLInputElement;
                        if (el && el.showPicker) { try { el.showPicker() } catch(e) {} }
                      }}
                    >
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Date de début
                    </label>
                    <input 
                      id="startDate"
                      type="date" 
                      {...register("startDate")}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
                    />
                  </div>
                  <div className="w-1/3 space-y-1.5">
                    <label 
                      className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors"
                      onClick={() => {
                        const el = document.getElementById('startTime') as HTMLInputElement;
                        if (el && el.showPicker) { try { el.showPicker() } catch(e) {} }
                      }}
                    >
                      <Clock className="w-3.5 h-3.5 text-indigo-500" /> Heure
                    </label>
                    <input 
                      id="startTime"
                      type="time" 
                      {...register("startTime")}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1 space-y-1.5">
                    <label 
                      className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors"
                      onClick={() => {
                        const el = document.getElementById('endDate') as HTMLInputElement;
                        if (el && el.showPicker) { try { el.showPicker() } catch(e) {} }
                      }}
                    >
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Date de fin
                    </label>
                    <input 
                      id="endDate"
                      type="date" 
                      {...register("endDate")}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
                    />
                  </div>
                  <div className="w-1/3 space-y-1.5">
                    <label 
                      className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors"
                      onClick={() => {
                        const el = document.getElementById('endTime') as HTMLInputElement;
                        if (el && el.showPicker) { try { el.showPicker() } catch(e) {} }
                      }}
                    >
                      <Clock className="w-3.5 h-3.5 text-indigo-500" /> Heure
                    </label>
                    <input 
                      id="endTime"
                      type="time" 
                      {...register("endTime")}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Priorité
                </label>
                <div className="flex bg-slate-100 dark:bg-slate-950 rounded-xl p-1 border border-slate-200 dark:border-slate-800">
                  {["BASSE", "MOYENNE", "HAUTE"].map((prio) => (
                    <label key={prio} className="flex-1 text-center cursor-pointer relative">
                      <input type="radio" value={prio} {...register("priority")} className="sr-only peer" />
                      <div className="py-2 px-1 text-[10px] sm:text-xs font-bold tracking-wider rounded-lg text-slate-500 dark:text-slate-400 peer-checked:bg-white dark:peer-checked:bg-slate-800 peer-checked:text-indigo-600 dark:peer-checked:text-indigo-400 peer-checked:shadow-sm transition-all">
                        {prio}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Lieu (Optionnel)
                </label>
                <input 
                  {...register("location")}
                  placeholder="Ex: Bureau, Maison, Salle de sport..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <AlignLeft className="w-3 h-3" /> Description (Optionnel)
                </label>
                <textarea 
                  {...register("description")}
                  rows={2}
                  placeholder="Détails, choses à ne pas oublier..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-medium text-sm custom-scrollbar"
                />
              </div>

            </form>

            {/* Bouton Fixé : Toujours visible sans scroller la page globale */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-auto">
              <button 
                onClick={handleSubmit(onSubmit)}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-base transition-all active:scale-95 shadow-lg shadow-indigo-600/30 tracking-wide"
              >
                Planifier le programme
              </button>
            </div>

          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
