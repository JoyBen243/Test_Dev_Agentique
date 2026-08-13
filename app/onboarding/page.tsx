"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Watch, ArrowRight, ArrowLeft, CheckCircle2, Volume2, Plus, Sparkles, ShieldCheck } from "lucide-react"
import { CreateProgramDrawer } from "@/components/CreateProgramDrawer"
import { useSettingsStore } from "@/store/useSettingsStore"
import { useProgramStore } from "@/store/useProgramStore"

export default function OnboardingPage() {
  const router = useRouter()
  const onboardingStep = useSettingsStore((state) => state.onboardingStep)
  const setOnboardingStep = useSettingsStore((state) => state.setOnboardingStep)
  const isOnboarded = useSettingsStore((state) => state.isOnboarded)
  const programs = useProgramStore((state) => state.programs)

  const [slideIndex, setSlideIndex] = useState(0)

  useEffect(() => {
    // Si l'utilisateur a déjà terminé l'onboarding, redirection vers dashboard
    if (isOnboarded) {
      router.push('/dashboard')
    }
  }, [isOnboarded, router])

  const slides = [
    {
      badge: "Vision My_MudaPlan",
      title: "Maîtrisez votre Temps",
      highlight: "en toute liberté.",
      description: "Une application de gestion d'agenda 100% hors-ligne conçue pour votre discipline personnelle sans faille.",
      icon: Watch,
      iconColor: "text-indigo-500",
      glowColor: "bg-indigo-500",
    },
    {
      badge: "Système de Statuts Strict",
      title: "Suivi Automatisé",
      highlight: "en temps réel.",
      description: "Vos tâches basculent automatiquement entre En attente, En cours et En observation selon l'heure exacte.",
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
      glowColor: "bg-emerald-500",
    },
    {
      badge: "Immersion & Discipline",
      title: "Signalisation Sonore",
      highlight: "& Bilan Quotidien.",
      description: "Alertes sonores au début/fin de chaque tâche, résumé matinal des programmes à réaliser et bilan du soir pour ce qui a été fait, abandonné ou reporté.",
      icon: Volume2,
      iconColor: "text-purple-500",
      glowColor: "bg-purple-500",
    },
  ]

  const handleNextSlide = () => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex(slideIndex + 1)
    } else {
      // Passage à l'étape du Premier Programme
      setOnboardingStep('FIRST_PROGRAM')
    }
  }

  const handlePrevSlide = () => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1)
    }
  }

  // Étape 2 (ou si le mode est FIRST_PROGRAM) : Écran "Ajouter un programme pour commencer"
  if (onboardingStep === 'FIRST_PROGRAM' || (slideIndex === slides.length && onboardingStep !== 'MANDATORY_SETTINGS')) {
    return (
      <div className="flex flex-col min-h-screen p-6 bg-slate-950 text-white justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <Watch className="w-6 h-6 text-indigo-400" />
            <span className="font-black tracking-widest text-sm text-indigo-300">My_MudaPlan</span>
          </div>
          <span className="text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            Étape 2 / 3
          </span>
        </div>

        {/* Appel à l'action initial */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 my-auto max-w-sm mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-30 rounded-full"></div>
            <div className="w-32 h-32 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center relative z-10 shadow-2xl">
              <Sparkles className="w-16 h-16 text-indigo-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Premier Lancement
            </div>
            <h1 className="text-3xl font-black tracking-tight leading-tight">
              Ajouter un programme <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                pour commencer
              </span>
            </h1>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Créez votre première tâche ci-dessous. Dès sa planification, nous configurerons votre identité et vos alertes.
            </p>
          </div>

          <CreateProgramDrawer trigger={
            <button className="w-full flex items-center justify-center gap-3 py-4 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl shadow-indigo-600/30">
              <Plus className="w-6 h-6 stroke-[3px]" />
              Ajouter un programme
            </button>
          } />
        </div>

        {/* Footer info */}
        <div className="pb-6 text-center text-xs text-slate-500 font-medium">
          Une configuration obligatoire suivra automatiquement.
        </div>
      </div>
    )
  }

  // Étape 1 : Carrousel des Écrans d'Introduction
  const currentSlide = slides[slideIndex]
  const CurrentIcon = currentSlide.icon

  return (
    <div className="flex flex-col min-h-screen p-6 bg-slate-950 text-white justify-between">
      {/* Top Bar */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <Watch className="w-6 h-6 text-indigo-400" />
          <span className="font-black tracking-widest text-sm text-indigo-300">My_MudaPlan</span>
        </div>

        <button 
          onClick={() => setOnboardingStep('FIRST_PROGRAM')} 
          className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          Passer
        </button>
      </div>

      {/* Slide Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 max-w-sm mx-auto my-auto transition-all duration-300">
        
        <div className="relative">
          <div className={`absolute inset-0 ${currentSlide.glowColor} blur-3xl opacity-25 rounded-full`}></div>
          <div className="w-36 h-36 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center relative z-10 shadow-2xl">
            <CurrentIcon className={`w-20 h-20 ${currentSlide.iconColor}`} strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-3.5 py-1 rounded-full border border-indigo-800/40">
            {currentSlide.badge}
          </span>

          <h1 className="text-3xl font-black tracking-tight leading-tight">
            {currentSlide.title} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              {currentSlide.highlight}
            </span>
          </h1>

          <p className="text-sm text-slate-400 font-medium leading-relaxed px-2">
            {currentSlide.description}
          </p>
        </div>

      </div>

      {/* Controls & Navigation Footer */}
      <div className="pb-8 space-y-6">
        
        {/* Indicators */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSlideIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === slideIndex ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-800 hover:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          {slideIndex > 0 && (
            <button
              onClick={handlePrevSlide}
              className="p-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-2xl font-bold transition-all active:scale-95"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}

          <button
            onClick={handleNextSlide}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg shadow-indigo-600/30"
          >
            {slideIndex === slides.length - 1 ? (
              <>Commencer <ArrowRight className="w-5 h-5" /></>
            ) : (
              <>Suivant <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}

