import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Settings {
  id: string
  tone: string
  title: string
  audioEnabled: boolean
  language: string
  theme: string
  viewType: string
}

export type OnboardingStep = 'SLIDES' | 'FIRST_PROGRAM' | 'MANDATORY_SETTINGS' | 'COMPLETED'

interface SettingsStore {
  settings: Settings
  isLoading: boolean
  isOnboarded: boolean
  onboardingStep: OnboardingStep
  
  // Actions pour modifier l'état local
  setSettings: (settings: Settings) => void
  updateSetting: (key: keyof Omit<Settings, 'id'>, value: string | boolean) => void
  setLoading: (loading: boolean) => void
  setOnboardingStep: (step: OnboardingStep) => void
  completeOnboarding: () => void
  resetOnboarding: () => void
}

const defaultSettings: Settings = {
  id: 'default-settings',
  tone: 'MASCULIN',
  title: 'Mr',
  audioEnabled: true,
  language: 'FR',
  theme: 'CLAIR',
  viewType: 'GRILLE',
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      isLoading: false,
      isOnboarded: false,
      onboardingStep: 'SLIDES',

      setSettings: (settings) => set({ settings, isLoading: false }),

      updateSetting: (key, value) => set((state) => ({
        settings: {
          ...state.settings,
          [key]: value
        }
      })),

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
    }),
    {
      name: 'my-mudaplan-settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
