"use client"
import * as React from "react"
import { Trash2, Ban } from "lucide-react"
import { useSettingsStore } from "@/store/useSettingsStore"
import { useTranslation } from "@/lib/i18n"

interface ConfirmActionModalProps {
  isOpen: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: "danger" | "warning"
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmActionModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmActionModalProps) {
  const settings = useSettingsStore((state) => state.settings)
  const t = useTranslation(settings.language)

  if (!isOpen) return null

  const defaultTitle = variant === "danger" ? t("delete") : t("action_abandon")
  const defaultConfirmText = variant === "danger" ? t("delete") : t("action_abandon")
  const defaultCancelText = t("cancel")

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay sombre avec effet de flou */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onCancel}
      />

      {/* Carte du dialogue */}
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl animate-in zoom-in-95 duration-200 z-10 space-y-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              variant === "danger"
                ? "bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400"
                : "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
            }`}
          >
            {variant === "danger" ? (
              <Trash2 className="w-5 h-5" />
            ) : (
              <Ban className="w-5 h-5" />
            )}
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
              {title || defaultTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Boutons d'action clairs : Annuler et Confirmer */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs transition-all active:scale-95 text-center"
          >
            {cancelText || defaultCancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition-all active:scale-95 text-center text-white shadow-md ${
              variant === "danger"
                ? "bg-red-600 hover:bg-red-500 shadow-red-600/20"
                : "bg-amber-600 hover:bg-amber-500 shadow-amber-600/20"
            }`}
          >
            {confirmText || defaultConfirmText}
          </button>
        </div>
      </div>
    </div>
  )
}