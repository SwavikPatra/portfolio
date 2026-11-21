import { createContext, useContext } from 'react'
import type { SceneThemeId } from './sceneTheme'

export interface SceneThemeValue {
  sceneTheme: SceneThemeId
  setSceneTheme: (theme: SceneThemeId) => void
  cycleSceneTheme: () => void
}

export const SceneThemeContext = createContext<SceneThemeValue | null>(null)

export function useSceneTheme(): SceneThemeValue {
  const ctx = useContext(SceneThemeContext)
  if (!ctx) throw new Error('useSceneTheme must be used within SceneThemeProvider')
  return ctx
}
