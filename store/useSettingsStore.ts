import { create } from 'zustand'

// Définition de l'interface Settings basée sur notre schéma Prisma
export interface Settings {
  id: string
  tone: string
  title: string
  audioEnabled: boolean
  language: string
  theme: string
  viewType: string
}

interface SettingsStore {
  settings: Settings | null
  isLoading: boolean
  
  // Actions pour modifier l'état local
  setSettings: (settings: Settings) => void
  updateSetting: (key: keyof Omit<Settings, 'id'>, value: string | boolean) => void
  setLoading: (loading: boolean) => void
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: null,
  isLoading: true, // Vrai par défaut jusqu'au chargement depuis SQLite

  // Initialise le store avec les données complètes de la BDD
  setSettings: (settings) => set({ settings, isLoading: false }),

  // Met à jour une propriété spécifique (optimistic update)
  updateSetting: (key, value) => set((state) => {
    if (!state.settings) return state
    return {
      settings: {
        ...state.settings,
        [key]: value
      }
    }
  }),

  setLoading: (isLoading) => set({ isLoading }),
}))
