import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { soundManager } from '@/lib/audio'
import { generateId } from '@/lib/utils'
import { 
  fetchProgramsClient as fetchProgramsAction, 
  createProgramClient as createProgramAction, 
  updateProgramClient as updateProgramAction, 
  deleteProgramClient as deleteProgramAction, 
  syncAllProgramsClient as syncAllProgramsAction,
} from '@/lib/actions/clientStorage'
import type { ProgramDto } from '@/lib/actions/programActions'

export interface Program {
  id: string
  title: string
  startTime: Date | string
  endTime: Date | string
  location: string | null
  description: string | null
  priority: string
  status: string // 'EN_ATTENTE', 'EN_COURS', 'FAIT', 'EN_OBSERVATION', 'REPORTE', 'ABANDONNE'
  originalId: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
}

interface ProgramStore {
  programs: Program[]
  isLoading: boolean
  _hasHydrated: boolean
  
  // Actions CRUD
  setPrograms: (programs: Program[]) => void
  addProgram: (program: Program) => void
  updateProgram: (id: string, updates: Partial<Program>) => void
  deleteProgram: (id: string) => void
  
  // Actions métier interactives
  markAsDone: (id: string) => void
  abandonProgram: (id: string) => void
  postponeProgram: (id: string, newStartTime: Date | string, newEndTime: Date | string) => void
  
  // Synchronisation avec la base SQLite
  loadFromDatabase: () => Promise<void>
  syncToDatabase: () => Promise<void>

  // Action de rafraîchissement & Audio
  refreshStatuses: () => void
  setLoading: (loading: boolean) => void
  setHasHydrated: (state: boolean) => void
}

export const useProgramStore = create<ProgramStore>()(
  persist(
    (set, get) => ({
      programs: [],
      isLoading: false,
      _hasHydrated: false,
      
      // Remplacer toute la liste
      setPrograms: (programs) => set({ programs, isLoading: false }),
      
      // Charger les programmes depuis SQLite
      loadFromDatabase: async () => {
        try {
          const dbPrograms = await fetchProgramsAction()
          if (dbPrograms && dbPrograms.length > 0) {
            set({ programs: dbPrograms as Program[], isLoading: false })
          } else if (get().programs.length > 0) {
            await syncAllProgramsAction(get().programs as any)
          }
        } catch (err) {
          console.error("Impossible de charger depuis SQLite:", err)
        }
      },

      // Synchroniser tous les programmes locaux vers SQLite
      syncToDatabase: async () => {
        try {
          await syncAllProgramsAction(get().programs as any)
        } catch (err) {
          console.error("Erreur syncToDatabase:", err)
        }
      },

      // Ajouter un programme
      addProgram: (program) => {
        set((state) => ({ 
          programs: [...state.programs, program] 
        }))
        createProgramAction(program as any).catch(console.error)
      },
      
      // Mettre à jour un programme existant
      updateProgram: (id, updates) => {
        set((state) => ({
          programs: state.programs.map((p) => (p.id === id ? { ...p, ...updates } : p))
        }))
        updateProgramAction(id, updates as any).catch(console.error)
      },
      
      // Supprimer un programme
      deleteProgram: (id) => {
        set((state) => ({
          programs: state.programs.filter((p) => p.id !== id)
        }))
        deleteProgramAction(id).catch(console.error)
      },

      // Marquer comme FAIT
      markAsDone: (id) => {
        soundManager.playSuccessSound()
        const nowIso = new Date().toISOString()
        set((state) => ({
          programs: state.programs.map((p) => 
            p.id === id ? { ...p, status: 'FAIT', updatedAt: nowIso } : p
          )
        }))
        updateProgramAction(id, { status: 'FAIT', updatedAt: nowIso }).catch(console.error)
      },

      // Abandonner un programme
      abandonProgram: (id) => {
        soundManager.playTaskObservationSound()
        const nowIso = new Date().toISOString()
        set((state) => ({
          programs: state.programs.map((p) => 
            p.id === id ? { ...p, status: 'ABANDONNE', updatedAt: nowIso } : p
          )
        }))
        updateProgramAction(id, { status: 'ABANDONNE', updatedAt: nowIso }).catch(console.error)
      },

      // Reporter un programme vers une nouvelle date/heure
      postponeProgram: (id, newStartTime, newEndTime) => {
        soundManager.playTaskObservationSound()
        const currentProg = get().programs.find((p) => p.id === id)
        if (!currentProg) return

        const nowIso = new Date().toISOString()
        const newPostponedProgram: Program = {
          id: generateId(),
          title: currentProg.title,
          startTime: newStartTime,
          endTime: newEndTime,
          location: currentProg.location,
          description: currentProg.description,
          priority: currentProg.priority,
          status: 'EN_ATTENTE',
          originalId: currentProg.id,
          createdAt: nowIso,
          updatedAt: nowIso,
        }

        set((state) => ({
          programs: [
            ...state.programs.map((p) => 
              p.id === id ? { ...p, status: 'REPORTE', updatedAt: nowIso } : p
            ),
            newPostponedProgram,
          ]
        }))

        updateProgramAction(id, { status: 'REPORTE', updatedAt: nowIso }).catch(console.error)
        createProgramAction(newPostponedProgram as any).catch(console.error)

        get().refreshStatuses()
      },

      // Recalcul Automatique des Statuts selon l'heure & Déclenchement Audio
      refreshStatuses: () => {
        const now = new Date()
        let shouldPlayStart = false
        let shouldPlayObservation = false
        
        set((state) => {
          const updatedPrograms = state.programs.map((program) => {
            if (['FAIT', 'REPORTE', 'ABANDONNE'].includes(program.status)) {
              return program
            }

            const start = new Date(program.startTime)
            const end = new Date(program.endTime)
            let newStatus = program.status

            if (now < start) {
              newStatus = 'EN_ATTENTE'
            } else if (now >= start && now <= end) {
              newStatus = 'EN_COURS'
              if (program.status === 'EN_ATTENTE') {
                shouldPlayStart = true
              }
            } else if (now > end) {
              newStatus = 'EN_OBSERVATION'
              if (program.status === 'EN_COURS' || program.status === 'EN_ATTENTE') {
                shouldPlayObservation = true
              }
            }

            if (newStatus !== program.status) {
              updateProgramAction(program.id, { status: newStatus, updatedAt: new Date().toISOString() }).catch(console.error)
              return { ...program, status: newStatus }
            }
            
            return program
          })

          const hasChanged = updatedPrograms.some((p, i) => p.status !== state.programs[i]?.status)
          return hasChanged ? { programs: updatedPrograms } : state
        })

        if (shouldPlayStart) {
          soundManager.playTaskStartSound()
        } else if (shouldPlayObservation) {
          soundManager.playTaskObservationSound()
        }
      },
      
      setLoading: (isLoading) => set({ isLoading }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'my-mudaplan-programs-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
        state?.loadFromDatabase().catch(console.error)
      },
    }
  )
)