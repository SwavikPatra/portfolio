import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { hourToSceneTheme, nextSceneTheme } from './sceneTheme'
import type { SceneThemeId } from './sceneTheme'
import { SceneThemeContext } from './scene-theme-context'

const STORAGE_KEY = 'portfolio-scene-theme'

interface SceneThemeState {
  theme: SceneThemeId
  auto: boolean
}

// Stored choice wins; otherwise start from the visitor's local clock in auto mode.
function readInitialState(): SceneThemeState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'morning' || stored === 'noon' || stored === 'sunset' || stored === 'night') {
      return { theme: stored, auto: false }
    }
  } catch {
    // localStorage unavailable (private mode) — fall through to time-based.
  }
  return { theme: hourToSceneTheme(new Date().getHours()), auto: true }
}

export function SceneThemeProvider({ children }: { children: ReactNode }) {
  const [{ theme: sceneTheme, auto: isAuto }, setSceneState] = useState<SceneThemeState>(readInitialState)

  const setSceneTheme = useCallback((theme: SceneThemeId) => {
    setSceneState({ theme, auto: false })
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Ignore persistence failures — session-only choice is fine.
    }
  }, [])

  const cycleSceneTheme = useCallback(() => {
    setSceneState((current) => {
      const theme = nextSceneTheme(current.theme)
      try {
        localStorage.setItem(STORAGE_KEY, theme)
      } catch {
        // Ignore persistence failures.
      }
      return { theme, auto: false }
    })
  }, [])

  const resetSceneThemeToAuto = useCallback(() => {
    setSceneState({ theme: hourToSceneTheme(new Date().getHours()), auto: true })
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore persistence failures.
    }
  }, [])

  // Only auto mode keeps following the visitor's local clock.
  useEffect(() => {
    if (!isAuto) return
    const id = window.setInterval(() => {
      setSceneState((current) => {
        if (!current.auto) return current
        const byTime = hourToSceneTheme(new Date().getHours())
        return byTime === current.theme ? current : { theme: byTime, auto: true }
      })
    }, 60_000)
    return () => window.clearInterval(id)
  }, [isAuto])

  const value = useMemo(
    () => ({ sceneTheme, isAuto, setSceneTheme, cycleSceneTheme, resetSceneThemeToAuto }),
    [sceneTheme, isAuto, setSceneTheme, cycleSceneTheme, resetSceneThemeToAuto],
  )

  return <SceneThemeContext.Provider value={value}>{children}</SceneThemeContext.Provider>
}
