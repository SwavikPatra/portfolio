import { createContext, useContext } from 'react'

export type ReadingAppearance = 'dark' | 'light'

export const READING_APPEARANCES: ReadingAppearance[] = ['dark', 'light']

export type ReadingTemperature = 'cool' | 'neutral' | 'warm'

export const READING_TEMPERATURES: ReadingTemperature[] = ['cool', 'neutral', 'warm']

export const TEXT_SCALES = [0.9, 1, 1.1] as const
export type TextScale = (typeof TEXT_SCALES)[number]

export interface ReadingModeContextValue {
  readingOn: boolean
  toggleReading: () => void
  appearance: ReadingAppearance
  setAppearance: (appearance: ReadingAppearance) => void
  temperature: ReadingTemperature
  setTemperature: (temperature: ReadingTemperature) => void
  textScale: TextScale
  stepTextScale: (direction: -1 | 1) => void
}

export const ReadingModeContext = createContext<ReadingModeContextValue | null>(null)

export function useReadingMode() {
  const ctx = useContext(ReadingModeContext)
  if (!ctx) throw new Error('useReadingMode must be used inside ReadingModeProvider')
  return ctx
}
