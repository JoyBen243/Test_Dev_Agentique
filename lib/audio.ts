// Moteur de sons Web Audio API (100% hors-ligne, sans dépendance externe)
import { useSettingsStore } from "@/store/useSettingsStore"

class SoundManager {
  private ctx: AudioContext | null = null

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  // Joue un son ascendant pour le début d'une tâche (Statut EN_COURS)
  playTaskStartSound() {
    const audioEnabled = useSettingsStore.getState().settings.audioEnabled
    if (!audioEnabled) return

    try {
      const ctx = this.getContext()
      if (!ctx) return

      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.3)

      gain.gain.setValueAtTime(0.01, now)
      gain.gain.linearRampToValueAtTime(0.25, now + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.4)
    } catch {
      // Ignorer silencieusement si bloqué
    }
  }

  // Joue un son d'alerte pour la fin d'une tâche (Statut EN_OBSERVATION)
  playTaskObservationSound() {
    const audioEnabled = useSettingsStore.getState().settings.audioEnabled
    if (!audioEnabled) return

    try {
      const ctx = this.getContext()
      if (!ctx) return

      const now = ctx.currentTime
      const delays: number[] = [0, 0.2]
      
      delays.forEach((delay: number) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(587.33, now + delay)
        
        gain.gain.setValueAtTime(0.01, now + delay)
        gain.gain.linearRampToValueAtTime(0.2, now + delay + 0.03)
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.15)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + delay)
        osc.stop(now + delay + 0.15)
      })
    } catch {
      // Ignorer
    }
  }

  // Joue un son de confirmation (Statut FAIT)
  playSuccessSound() {
    const audioEnabled = useSettingsStore.getState().settings.audioEnabled
    if (!audioEnabled) return

    try {
      const ctx = this.getContext()
      if (!ctx) return

      const now = ctx.currentTime
      const notes = [523.25, 659.25, 783.99, 1046.50]

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        const noteStart = now + idx * 0.08
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, noteStart)

        gain.gain.setValueAtTime(0.01, noteStart)
        gain.gain.linearRampToValueAtTime(0.18, noteStart + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.25)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(noteStart)
        osc.stop(noteStart + 0.25)
      })
    } catch {
      // Ignorer
    }
  }
}

export const soundManager = new SoundManager()
