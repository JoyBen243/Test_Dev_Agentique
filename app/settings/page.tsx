"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { Moon, Sun, Volume2, Globe, User, ShieldCheck, Check, ArrowRight, LayoutGrid, List } from "lucide-react"
import { useTheme } from "next-themes"
import { useSettingsStore } from "@/store/useSettingsStore"
import { Suspense } from "react"

function SettingsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setTheme, theme } = useTheme()

  const settings = useSettingsStore((state) => state.settings)
  const updateSetting = useSettingsStore((state) => state.updateSetting)
  const isOnboarded = useSettingsStore((state) => state.isOnboarded)
  const completeOnboarding = useSettingsStore((state) => state.completeOnboarding)

  const isMandatoryOnboarding = searchParams.get('onboarding') === 'true' || !isOnboarded

  const handleFinishOnboarding = () => {
    completeOnboarding()
    router.push('/dashboard')
  }

  return (
    <div className="flex flex-col min-h-full p-6 pb-24 max-w-lg mx-auto w-full">
      {/* Banner de Configuration Obligatoire pendant l'Onboarding */}
      {isMandatoryOnboarding && (
        <div className="mb-6 p-5 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl shadow-xl border border-indigo-500/30 space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            <span className="text-xs font-black uppercase tracking-wider text-indigo-300">Étape 3 / 3 • Configuration Obligatoire</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">Définissez votre profil</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Votre premier programme a été planifié ! Veuillez valider votre identité et la langue par défaut avant d'accéder au tableau de bord.
          </p>
        </div>
      )}

      <header className="mb-8 mt-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Paramètres</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Personnalisez votre expérience My_MudaPlan</p>
      </header>

      <div className="space-y-6">

        {/* Section 1 : Identité */}
        <section className="space-y-3">
          <h2 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-4 h-4" /> Identité Utilisateur
          </h2>
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 shadow-sm">
            {/* Titre */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">Titre de civilité</label>
              <div className="grid grid-cols-3 gap-2">
                {['Mr', 'Mme', 'Mlle'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => updateSetting('title', t)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                      settings.title === t
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Ton */}
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">Ton d'interaction</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'MASCULIN', label: 'Masculin' },
                  { key: 'FEMININ', label: 'Féminin' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => updateSetting('tone', item.key)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                      settings.tone === item.key
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 : Langue */}
        <section className="space-y-3">
          <h2 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-4 h-4" /> Langue
          </h2>
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'FR', label: 'Français' },
                { code: 'EN', label: 'English' },
                { code: 'SW', label: 'Kiswahili' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => updateSetting('language', lang.code)}
                  className={`py-2.5 px-2 text-center rounded-xl text-xs font-bold transition-all border ${
                    settings.language === lang.code
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3 : Apparence & Vue */}
        <section className="space-y-3">
          <h2 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sun className="w-4 h-4" /> Apparence & Vue
          </h2>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-sm overflow-hidden">
            {/* Dark Mode */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-800 dark:text-slate-200">Thème Visuel</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Mode Clair ou Sombre</div>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => {
                  const newTheme = theme === 'dark' ? 'light' : 'dark'
                  setTheme(newTheme)
                  updateSetting('theme', newTheme === 'dark' ? 'SOMBRE' : 'CLAIR')
                }}
                className={`w-12 h-6 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </button>
            </div>

            {/* View Type */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  {settings.viewType === 'GRILLE' ? <LayoutGrid className="w-5 h-5 text-indigo-500" /> : <List className="w-5 h-5 text-indigo-500" />}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-800 dark:text-slate-200">Vue par défaut</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Grille ou Liste</div>
                </div>
              </div>

              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => updateSetting('viewType', 'GRILLE')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    settings.viewType === 'GRILLE' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Grille
                </button>
                <button
                  type="button"
                  onClick={() => updateSetting('viewType', 'LISTE')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    settings.viewType === 'LISTE' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Liste
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 : Audio & Alertes */}
        <section className="space-y-3">
          <h2 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 className="w-4 h-4" /> Notifications & Sons
          </h2>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <Volume2 className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-800 dark:text-slate-200">Alertes Sonores</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Au début & fin des plages horaires</div>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => updateSetting('audioEnabled', !settings.audioEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.audioEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.audioEnabled ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2 text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex justify-between items-center">
                <span>Rappel du matin :</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">05h15 - 07h00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Rappel du soir :</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">19h30</span>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Bouton d'action final pour l'Onboarding */}
      {isMandatoryOnboarding && (
        <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleFinishOnboarding}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl shadow-indigo-600/30"
          >
            Terminer & Accéder au Tableau de bord
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-slate-500 font-medium">Chargement des paramètres...</div>
    }>
      <SettingsContent />
    </Suspense>
  )
}

