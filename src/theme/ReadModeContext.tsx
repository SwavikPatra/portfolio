import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ReadingModeContext, TEXT_SCALES } from './read-mode-context'
import type { ReadingAppearance, ReadingTemperature, TextScale } from './read-mode-context'

const ON_KEY = 'portfolio-reading-mode'
const APPEARANCE_KEY = 'portfolio-reading-appearance'
const TEMPERATURE_KEY = 'portfolio-reading-temperature'
const SCALE_KEY = 'portfolio-reading-text-scale'

// Same compact breakpoint the scene uses (scene/hooks.ts).
const MOBILE_QUERY = '(max-width: 767px)'

function stored(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function persist(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* storage unavailable — setting stays in memory */
  }
}

function isMobile(): boolean {
  return window.matchMedia(MOBILE_QUERY).matches
}

function initialReadingOn(): boolean {
  const value = stored(ON_KEY)
  if (value === 'on' || value === 'off') return value === 'on'
  // Phones start in the calm, text-first reading mode.
  return isMobile()
}

function initialAppearance(): ReadingAppearance {
  const value = stored(APPEARANCE_KEY)
  if (value === 'dark' || value === 'light') return value
  if (isMobile()) return 'light'
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function initialTemperature(): ReadingTemperature {
  const value = stored(TEMPERATURE_KEY)
  return value === 'cool' || value === 'neutral' || value === 'warm' ? value : 'neutral'
}

function initialScale(): TextScale {
  const value = Number(stored(SCALE_KEY))
  return TEXT_SCALES.find((scale) => scale === value) ?? 1
}

export function ReadModeProvider({ children }: { children: ReactNode }) {
  const [readingOn, setReadingOn] = useState(initialReadingOn)
  const [appearance, setAppearanceState] = useState<ReadingAppearance>(initialAppearance)
  const [temperature, setTemperature] = useState<ReadingTemperature>(initialTemperature)
  const [textScale, setTextScale] = useState<TextScale>(initialScale)

  // Auto-defaults are mobile-only: don't write them to storage, or they'd leak
  // into desktop visits. They become real choices once the user changes them.
  const onChosen = useRef(stored(ON_KEY) !== null)
  const appearanceChosen = useRef(stored(APPEARANCE_KEY) !== null)

  useEffect(() => {
    document.documentElement.setAttribute('data-reading-mode', readingOn ? 'on' : 'off')
    if (onChosen.current) persist(ON_KEY, readingOn ? 'on' : 'off')
  }, [readingOn])

  useEffect(() => {
    document.documentElement.setAttribute('data-reading-appearance', appearance)
    if (appearanceChosen.current) persist(APPEARANCE_KEY, appearance)
  }, [appearance])

  useEffect(() => {
    document.documentElement.setAttribute('data-reading-temperature', temperature)
    persist(TEMPERATURE_KEY, temperature)
  }, [temperature])

  useEffect(() => {
    document.documentElement.setAttribute('data-reading-text-scale', String(textScale))
    persist(SCALE_KEY, String(textScale))
  }, [textScale])

  const toggleReading = useCallback(() => {
    onChosen.current = true
    setReadingOn((on) => !on)
  }, [])

  const setAppearance = useCallback((next: ReadingAppearance) => {
    appearanceChosen.current = true
    setAppearanceState(next)
  }, [])

  const stepTextScale = useCallback((direction: -1 | 1) => {
    setTextScale((current) => {
      const index = TEXT_SCALES.indexOf(current)
      const next = Math.min(TEXT_SCALES.length - 1, Math.max(0, index + direction))
      return TEXT_SCALES[next]
    })
  }, [])

  const value = useMemo(
    () => ({
      readingOn,
      toggleReading,
      appearance,
      setAppearance,
      temperature,
      setTemperature,
      textScale,
      stepTextScale,
    }),
    [readingOn, toggleReading, appearance, setAppearance, temperature, textScale, stepTextScale],
  )

  return <ReadingModeContext.Provider value={value}>{children}</ReadingModeContext.Provider>
}
