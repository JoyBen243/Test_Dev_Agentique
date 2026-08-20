import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { fetchSettingsClient as fetchSettingsAction, updateSettingsClient as updateSettingsAction } from '@/lib/actions/clientStorage'

export interface Settings {
  id: string
  tone: string
  title: string
  audioEnabled: boolean
  beepSound: string
  language: string
  theme: string
  viewType: string
  morningReminderTime: string
  eveningSummaryTime: string
}

export type OnboardingStep = 'SLIDES' | 'FIRST_PROGRAM' | 'MANDATORY_SETTINGS' | 'COMPLETED'

interface SettingsStore {
  settings: Settings
  isLoading: boolean
  isOnboarded: boolean
  onboardingStep: OnboardingStep
  _hasHydrated: boolean
  
  // Actions pour modifier l'état local
  setSettings: (settings: Settings) => void
  updateSetting: (key: keyof Omit<Settings, 'id'>, value: string | boolean) => void
  setLoading: (loading: boolean) => void
  setOnboardingStep: (step: OnboardingStep) => void
  completeOnboarding: () => void
  resetOnboarding: () => void
  setHasHydrated: (state: boolean) => void
  
  // Persistance SQLite
  loadSettingsFromDatabase: () => Promise<void>
}

const defaultSettings: Settings = {
  id: 'default-settings',
  tone: 'MASCULIN',
  title: 'Mr',
  audioEnabled: true,
  beepSound: 'MODERNE',
  language: 'FR',
  theme: 'CLAIR',
  viewType: 'LISTE',
  morningReminderTime: '05:15',
  eveningSummaryTime: '19:30',
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      isLoading: false,
      isOnboarded: false,
      onboardingStep: 'SLIDES',
      _hasHydrated: false,

      // Charger depuis SQLite
      loadSettingsFromDatabase: async () => {
        try {
          const dbSettings = await fetchSettingsAction()
          if (dbSettings) {
            set((state) => ({
              settings: {
                ...state.settings,
                tone: dbSettings.tone,
                title: dbSettings.title,
                audioEnabled: dbSettings.audioEnabled,
                beepSound: dbSettings.beepSound || 'MODERNE',
                language: dbSettings.language,
                theme: dbSettings.theme,
                viewType: dbSettings.viewType,
                morningReminderTime: dbSettings.morningReminderTime,
                eveningSummaryTime: dbSettings.eveningSummaryTime,
              }
            }))
          }
        } catch (err) {
          console.error("Erreur loadSettingsFromDatabase:", err)
        }
      },

      setSettings: (settings) => set({ settings }),

      updateSetting: (key, value) => {
        set((state) => ({
          settings: { ...state.settings, [key]: value },
        }))
        // Sauvegarde SQLite en tâche de fond
        updateSettingsAction({ [key]: value } as any).catch(console.error)
      },

      setLoading: (isLoading) => set({ isLoading }),

      setOnboardingStep: (step) => set({ onboardingStep: step }),

      completeOnboarding: () => set({ 
        isOnboarded: true, 
        onboardingStep: 'COMPLETED' 
      }),

      resetOnboarding: () => set({ 
        isOnboarded: false, 
        onboardingStep: 'SLIDES' 
      }),

      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'my-mudaplan-settings-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
        state?.loadSettingsFromDatabase().catch(console.error)
      },
    }
  )
)