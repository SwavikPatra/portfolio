import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ReadingModeContext, TEXT_SCALES } from './read-mode-context'
import type { ReadingAppearance, ReadingTemperature, TextScale } from './read-mode-context'

const ON_KEY = 'portfolio-reading-mode'
const APPEARANCE_KEY = 'portfolio-reading-appearance'
const TEMPERATURE_KEY = 'portfolio-reading-temperature'
const SCALE_KEY = 'portfolio-reading-text-scale'

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

function initialAppearance(): ReadingAppearance {
  const value = stored(APPEARANCE_KEY)
  if (value === 'dark' || value === 'light') return value
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
  const [readingOn, setReadingOn] = useState(() => stored(ON_KEY) === 'on')
  const [appearance, setAppearance] = useState<ReadingAppearance>(initialAppearance)
  const [temperature, setTemperature] = useState<ReadingTemperature>(initialTemperature)
  const [textScale, setTextScale] = useState<TextScale>(initialScale)

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-reading-mode', readingOn ? 'on' : 'off')
    persist(ON_KEY, readingOn ? 'on' : 'off')
  }, [readingOn])

  useEffect(() => {
    document.documentElement.setAttribute('data-reading-appearance', appearance)
    persist(APPEARANCE_KEY, appearance)
  }, [appearance])

  useEffect(() => {
    document.documentElement.setAttribute('data-reading-temperature', temperature)
    persist(TEMPERATURE_KEY, temperature)
  }, [temperature])

  useEffect(() => {
    document.documentElement.setAttribute('data-reading-text-scale', String(textScale))
    persist(SCALE_KEY, String(textScale))
  }, [textScale])

  const toggleReading = useCallback(() => setReadingOn((on) => !on), [])

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
    [readingOn, toggleReading, appearance, temperature, textScale, stepTextScale],
  )

  return <ReadingModeContext.Provider value={value}>{children}</ReadingModeContext.Provider>
}
