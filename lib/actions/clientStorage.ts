// Adaptateur de stockage 100% client-side pour Capacitor / Export Statique
// Remplace les Server Actions Prisma par des opérations localStorage pures
// Zustand persist gère déjà la persistance réelle — ces fonctions sont des
// passthrough/no-ops qui maintiennent la compatibilité d'interface avec les stores.

import type { ProgramDto } from './programActions'
import type { SettingsDto } from './settingsActions'

const PROGRAMS_KEY = 'my-mudaplan-programs-storage'
const SETTINGS_KEY = 'my-mudaplan-settings-storage'

// ─── Programmes ───────────────────────────────────────────────

export async function fetchProgramsClient(): Promise<ProgramDto[]> {
  try {
    const raw = localStorage.getItem(PROGRAMS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return (parsed?.state?.programs || []) as ProgramDto[]
  } catch {
    return []
  }
}

export async function createProgramClient(_data: ProgramDto) {
  // No-op : Zustand persist écrit déjà dans localStorage
  return { success: true }
}

export async function updateProgramClient(_id: string, _updates: Partial<ProgramDto>) {
  return { success: true }
}

export async function deleteProgramClient(_id: string) {
  return { success: true }
}

export async function syncAllProgramsClient(_programs: ProgramDto[]) {
  return { success: true }
}

// ─── Paramètres ───────────────────────────────────────────────

export async function fetchSettingsClient(): Promise<SettingsDto | null> {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return (parsed?.state?.settings || null) as SettingsDto | null
  } catch {
    return null
  }
}

export async function updateSettingsClient(_data: Partial<SettingsDto>) {
  return { success: true }
}
