import { Accessibility, Contrast, Moon, Sun, Type } from 'lucide-react'
import { useEffect, useState } from 'react'

type AccessibilitySettings = {
  theme: 'light' | 'dark'
  contrast: 'normal' | 'high'
  textSize: 'small' | 'medium' | 'large'
  boldText: boolean
}

const STORAGE_KEY = 'campus-events-a11y'

const DEFAULT_SETTINGS: AccessibilitySettings = {
  theme: 'light',
  contrast: 'normal',
  textSize: 'medium',
  boldText: false,
}

function applySettings(settings: AccessibilitySettings) {
  const root = document.documentElement
  root.dataset.theme = settings.theme
  root.dataset.contrast = settings.contrast
  root.dataset.textSize = settings.textSize
  document.body.classList.toggle('a11y-bold', settings.boldText)
}

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS)

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.removeItem(STORAGE_KEY)
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as AccessibilitySettings
        const nextSettings: AccessibilitySettings = {
          theme: parsed.theme === 'dark' ? 'dark' : 'light',
          contrast: parsed.contrast === 'high' ? 'high' : 'normal',
          textSize:
            parsed.textSize === 'small' || parsed.textSize === 'large'
              ? parsed.textSize
              : 'medium',
          boldText: Boolean(parsed.boldText),
        }
        setSettings(nextSettings)
        applySettings(nextSettings)
        return
      }
    } catch {
      // Fallback to defaults below.
    }

    applySettings(DEFAULT_SETTINGS)
  }, [])

  useEffect(() => {
    applySettings(settings)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  return (
    <div className="fixed bottom-5 right-5 z-[120]">
      {open ? (
        <div className="mb-3 w-72 rounded-2xl border border-border bg-card p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Accessibility</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 text-xs hover:bg-accent"
              aria-label="Close accessibility controls"
            >
              Close
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="space-y-2">
              <p className="font-medium">Theme</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`btn ${settings.theme === 'light' ? 'btn-primary' : 'btn-secondary'} flex-1`}
                  onClick={() => setSettings((current) => ({ ...current, theme: 'light' }))}
                >
                  <Sun className="mr-1 h-4 w-4" />
                  Light
                </button>
                <button
                  type="button"
                  className={`btn ${settings.theme === 'dark' ? 'btn-primary' : 'btn-secondary'} flex-1`}
                  onClick={() => setSettings((current) => ({ ...current, theme: 'dark' }))}
                >
                  <Moon className="mr-1 h-4 w-4" />
                  Dark
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Contrast</p>
              <button
                type="button"
                className={`btn ${settings.contrast === 'high' ? 'btn-primary' : 'btn-secondary'} w-full`}
                onClick={() =>
                  setSettings((current) => ({
                    ...current,
                    contrast: current.contrast === 'high' ? 'normal' : 'high',
                  }))
                }
              >
                <Contrast className="mr-1 h-4 w-4" />
                {settings.contrast === 'high' ? 'High Contrast On' : 'High Contrast Off'}
              </button>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Text Size</p>
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`btn ${settings.textSize === size ? 'btn-primary' : 'btn-secondary'} flex-1`}
                    onClick={() => setSettings((current) => ({ ...current, textSize: size }))}
                  >
                    {size === 'small' ? 'A-' : size === 'medium' ? 'A' : 'A+'}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className={`btn ${settings.boldText ? 'btn-primary' : 'btn-secondary'} w-full`}
              onClick={() => setSettings((current) => ({ ...current, boldText: !current.boldText }))}
            >
              <Type className="mr-1 h-4 w-4" />
              {settings.boldText ? 'Bold Text On' : 'Bold Text Off'}
            </button>

            <button
              type="button"
              className="btn btn-secondary w-full"
              onClick={resetSettings}
            >
              Reset Accessibility Settings
            </button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary-foreground/20 bg-primary text-primary-foreground shadow-2xl transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring"
        aria-label="Open accessibility controls"
        title="Accessibility controls"
      >
        <Accessibility className="h-6 w-6" />
      </button>
    </div>
  )
}
