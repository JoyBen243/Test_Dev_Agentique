import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { soundManager } from '@/lib/audio'
import { generateId } from '@/lib/utils'

// Définition de l'interface Program basée sur le schéma Prisma
export interface Program {
  id: string
  title: string
  startTime: Date | string // Peut être une string (ISO) venant de l'API ou localStorage
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
  
  // Actions CRUD basiques
  setPrograms: (programs: Program[]) => void
  addProgram: (program: Program) => void
  updateProgram: (id: string, updates: Partial<Program>) => void
  deleteProgram: (id: string) => void
  
  // Actions métier interactives (Option 3)
  markAsDone: (id: string) => void
  abandonProgram: (id: string) => void
  postponeProgram: (id: string, newStartTime: Date | string, newEndTime: Date | string) => void
  
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
      
      // Remplacer toute la liste (chargement initial)
      setPrograms: (programs) => set({ programs, isLoading: false }),
      
      // Ajouter un programme
      addProgram: (program) => set((state) => ({ 
        programs: [...state.programs, program] 
      })),
      
      // Mettre à jour un programme existant
      updateProgram: (id, updates) => set((state) => ({
        programs: state.programs.map((p) => (p.id === id ? { ...p, ...updates } : p))
      })),
      
      // Supprimer un programme
      deleteProgram: (id) => set((state) => ({
        programs: state.programs.filter((p) => p.id !== id)
      })),

      // Marquer comme FAIT
      markAsDone: (id) => {
        soundManager.playSuccessSound()
        set((state) => ({
          programs: state.programs.map((p) => 
            p.id === id ? { ...p, status: 'FAIT', updatedAt: new Date().toISOString() } : p
          )
        }))
      },

      // Abandonner un programme
      abandonProgram: (id) => {
        set((state) => ({
          programs: state.programs.map((p) => 
            p.id === id ? { ...p, status: 'ABANDONNE', updatedAt: new Date().toISOString() } : p
          )
        }))
      },

      // Reporter un programme vers une nouvelle date/heure
      postponeProgram: (id, newStartTime, newEndTime) => {
        const currentProg = get().programs.find((p) => p.id === id)
        if (!currentProg) return

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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set((state) => ({
          programs: [
            ...state.programs.map((p) => 
              p.id === id ? { ...p, status: 'REPORTE', updatedAt: new Date().toISOString() } : p
            ),
            newPostponedProgram,
          ]
        }))

        get().refreshStatuses()
      },

      // Fonction clé : Recalcul Automatique des Statuts selon l'heure & Déclenchement Audio
      refreshStatuses: () => {
        const now = new Date()
        let shouldPlayStart = false
        let shouldPlayObservation = false
        
        set((state) => {
          const updatedPrograms = state.programs.map((program) => {
            // Les statuts validés manuellement par l'utilisateur ne sont jamais écrasés
            if (['FAIT', 'REPORTE', 'ABANDONNE'].includes(program.status)) {
              return program
            }

            const start = new Date(program.startTime)
            const end = new Date(program.endTime)
            let newStatus = program.status

            // Logique de temps
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
      },
    }
  )
)
