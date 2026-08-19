import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  if (typeof window !== 'undefined' && typeof window.crypto !== 'undefined' && typeof window.crypto.randomUUID === 'function') {
    try {
      return window.crypto.randomUUID()
    } catch {
      // Fallback
    }
  }
  return 'prog_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9)
}
