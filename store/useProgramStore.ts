import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Définition de l'interface Program basée sur le schéma Prisma
export interface Program {
  id: string
  title: string
  startTime: Date | string // Peut être une string (ISO) venant de l'API
  endTime: Date | string
  location: string | null
  description: string | null
  priority: string
  status: string
  originalId: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
}

interface ProgramStore {
  programs: Program[]
  isLoading: boolean
  
  // Actions CRUD basiques
  setPrograms: (programs: Program[]) => void
  addProgram: (program: Program) => void
  updateProgram: (id: string, updates: Partial<Program>) => void
  deleteProgram: (id: string) => void
  
  // Action métier
  refreshStatuses: () => void
  setLoading: (loading: boolean) => void
}

export const useProgramStore = create<ProgramStore>()(
  persist(
    (set, get) => ({
      programs: [],
      isLoading: false,
      
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

      // Fonction clé : Recalcul Automatique des Statuts selon l'heure
      refreshStatuses: () => {
        const now = new Date()
        
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
            } else if (now > end) {
              newStatus = 'EN_OBSERVATION'
            }

            // Si le statut a changé, on retourne le programme mis à jour
            if (newStatus !== program.status) {
              return { ...program, status: newStatus }
            }
            
            return program
          })

          // On compare les références pour éviter des re-rendus React inutiles
          // si aucun statut n'a réellement changé.
          const hasChanged = updatedPrograms.some((p, i) => p.status !== state.programs[i].status)
          return hasChanged ? { programs: updatedPrograms } : state
        })
      },
      
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'my-mudaplan-programs-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
