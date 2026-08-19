"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Watch, ArrowRight, ArrowLeft, CheckCircle2, Volume2, Plus, Sparkles, ShieldCheck } from "lucide-react"
import { CreateProgramDrawer } from "@/components/CreateProgramDrawer"
import { useSettingsStore } from "@/store/useSettingsStore"
import { useTranslation } from "@/lib/i18n"

export default function OnboardingPage() {
  const router = useRouter()
  const onboardingStep = useSettingsStore((state) => state.onboardingStep)
  const setOnboardingStep = useSettingsStore((state) => state.setOnboardingStep)
  const isOnboarded = useSettingsStore((state) => state.isOnboarded)
  const language = useSettingsStore((state) => state.settings.language)
  const t = useTranslation(language)

  const [slideIndex, setSlideIndex] = useState(0)

  useEffect(() => {
    if (isOnboarded) {
      router.push('/dashboard')
    }
  }, [isOnboarded, router])

  const slides = [
    {
      badge: t("slide1_badge"),
      title: t("slide1_title"),
      highlight: t("slide1_highlight"),
      description: t("slide1_desc"),
      icon: Watch,
      iconColor: "text-indigo-500",
      glowColor: "bg-indigo-500",
    },
    {
      badge: t("slide2_badge"),
      title: t("slide2_title"),
      highlight: t("slide2_highlight"),
      description: t("slide2_desc"),
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
      glowColor: "bg-emerald-500",
    },
    {
      badge: t("slide3_badge"),
      title: t("slide3_title"),
      highlight: t("slide3_highlight"),
      description: t("slide3_desc"),
      icon: Volume2,
      iconColor: "text-purple-500",
      glowColor: "bg-purple-500",
    },
  ]

  const handleNextSlide = () => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex(slideIndex + 1)
    } else {
      setOnboardingStep('FIRST_PROGRAM')
    }
  }

  const handlePrevSlide = () => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1)
    }
  }

  if (onboardingStep === 'FIRST_PROGRAM' || (slideIndex === slides.length && onboardingStep !== 'MANDATORY_SETTINGS')) {
    return (
      <div className="flex flex-col min-h-[100dvh] p-4 sm:p-6 bg-slate-950 text-white justify-between">
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Watch className="w-5 h-5 text-indigo-400" />
            <span className="font-black tracking-widest text-xs sm:text-sm text-indigo-300">My_MudaPlan</span>
          </div>
          <span className="text-[11px] font-bold text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
            {t("onboarding_step_2")}
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 my-auto max-w-xs sm:max-w-sm mx-auto py-4">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-30 rounded-full"></div>
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center relative z-10 shadow-2xl">
              <Sparkles className="w-12 h-12 text-indigo-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-[11px] font-semibold">
              <ShieldCheck className="w-3 h-3" /> {t("onboarding_first_launch")}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {t("onboarding_add_first_title")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                {t("onboarding_add_first_highlight")}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
              {t("onboarding_add_first_desc")}
            </p>
          </div>

          <CreateProgramDrawer trigger={
            <button className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl sm:rounded-2xl font-black text-base transition-all active:scale-95 shadow-xl shadow-indigo-600/30">
              <Plus className="w-5 h-5 stroke-[3px]" />
              {t("new_program")}
            </button>
          } />
        </div>

        <div className="pb-3 text-center text-[11px] text-slate-500 font-medium">
          {t("onboarding_mandatory_note")}
        </div>
      </div>
    )
  }

  const currentSlide = slides[slideIndex]
  const CurrentIcon = currentSlide.icon

  return (
    <div className="flex flex-col min-h-[100dvh] p-4 sm:p-6 bg-slate-950 text-white justify-between">
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <Watch className="w-5 h-5 text-indigo-400" />
          <span className="font-black tracking-widest text-xs sm:text-sm text-indigo-300">My_MudaPlan</span>
        </div>

        <button 
          onClick={() => setOnboardingStep('FIRST_PROGRAM')} 
          className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          {t("skip")}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 max-w-xs sm:max-w-sm mx-auto my-auto py-2 transition-all duration-300">
        <div className="relative">
          <div className={`absolute inset-0 ${currentSlide.glowColor} blur-2xl opacity-25 rounded-full`}></div>
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center relative z-10 shadow-2xl">
            <CurrentIcon className={`w-14 h-14 sm:w-16 sm:h-16 ${currentSlide.iconColor}`} strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-3 py-0.5 rounded-full border border-indigo-800/40">
            {currentSlide.badge}
          </span>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            {currentSlide.title} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              {currentSlide.highlight}
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed px-1">
            {currentSlide.description}
          </p>
        </div>
      </div>

      <div className="pb-4 sm:pb-6 space-y-4">
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSlideIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === slideIndex ? 'w-6 bg-indigo-500' : 'w-1.5 bg-slate-800 hover:bg-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          {slideIndex > 0 && (
            <button
              onClick={handlePrevSlide}
              className="p-3.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl sm:rounded-2xl font-bold transition-all active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={handleNextSlide}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl sm:rounded-2xl font-bold text-base transition-all active:scale-95 shadow-lg shadow-indigo-600/30"
          >
            {slideIndex === slides.length - 1 ? (
              <>{t("start")} <ArrowRight className="w-4 h-4" /></>
            ) : (
              <>{t("next")} <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
