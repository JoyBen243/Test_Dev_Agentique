// Moteur de sons Web Audio API (100% hors-ligne, sans dépendance externe)
import { useSettingsStore } from "@/store/useSettingsStore"

export type BeepSoundType = 'DOUX' | 'MODERNE' | 'ENERGIQUE' | 'SUBTIL'

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

  // Joue un bip spécifique selon le style choisi (pour prévisualisation dans les réglages)
  playBeepPreview(beepType: BeepSoundType) {
    try {
      const ctx = this.getContext()
      if (!ctx) return

      const now = ctx.currentTime

      switch (beepType) {
        case 'DOUX': {
          // Bip doux et cristallin (sine wave)
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(587.33, now) // D5
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.18) // A5
          gain.gain.setValueAtTime(0.01, now)
          gain.gain.linearRampToValueAtTime(0.2, now + 0.03)
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now)
          osc.stop(now + 0.3)
          break
        }

        case 'MODERNE': {
          // Double bip ascendant moderne
          [0, 0.1].forEach((delay, idx) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = 'sine'
            const freq = idx === 0 ? 880 : 1320
            osc.frequency.setValueAtTime(freq, now + delay)
            gain.gain.setValueAtTime(0.01, now + delay)
            gain.gain.linearRampToValueAtTime(0.22, now + delay + 0.02)
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.12)
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.start(now + delay)
            osc.stop(now + delay + 0.12)
          })
          break
        }

        case 'ENERGIQUE': {
          // Triple arpège ascendant
          [523.25, 659.25, 783.99].forEach((freq, idx) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            const delay = idx * 0.07
            osc.type = 'triangle'
            osc.frequency.setValueAtTime(freq, now + delay)
            gain.gain.setValueAtTime(0.01, now + delay)
            gain.gain.linearRampToValueAtTime(0.22, now + delay + 0.02)
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.18)
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.start(now + delay)
            osc.stop(now + delay + 0.18)
          })
          break
        }

        case 'SUBTIL': {
          // Goutte d'eau douce / Wood chime
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(440, now)
          osc.frequency.exponentialRampToValueAtTime(330, now + 0.15)
          gain.gain.setValueAtTime(0.01, now)
          gain.gain.linearRampToValueAtTime(0.18, now + 0.01)
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now)
          osc.stop(now + 0.2)
          break
        }
      }
    } catch {
      // Ignorer silencieusement
    }
  }

  // Joue le bip pour le début d'une tâche (Statut EN_COURS)
  playTaskStartSound() {
    const { audioEnabled, beepSound } = useSettingsStore.getState().settings
    if (!audioEnabled) return
    this.playBeepPreview((beepSound as BeepSoundType) || 'MODERNE')
  }

  // Joue un son d'alerte pour la fin d'une tâche (Statut EN_OBSERVATION)
  playTaskObservationSound() {
    const audioEnabled = useSettingsStore.getState().settings.audioEnabled
    if (!audioEnabled) return

    try {
      const ctx = this.getContext()
      if (!ctx) return

      const now = ctx.currentTime
      const delays: number[] = [0, 0.18]
      
      delays.forEach((delay: number) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(659.25, now + delay)
        
        gain.gain.setValueAtTime(0.01, now + delay)
        gain.gain.linearRampToValueAtTime(0.22, now + delay + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.14)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + delay)
        osc.stop(now + delay + 0.14)
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

        const noteStart = now + idx * 0.07
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, noteStart)

        gain.gain.setValueAtTime(0.01, noteStart)
        gain.gain.linearRampToValueAtTime(0.18, noteStart + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.22)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(noteStart)
        osc.stop(noteStart + 0.22)
      })
    } catch {
      // Ignorer
    }
  }
}

export const soundManager = new SoundManager()

