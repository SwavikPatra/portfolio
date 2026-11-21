import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { hourToSceneTheme, nextSceneTheme } from './sceneTheme'
import type { SceneThemeId } from './sceneTheme'
import { SceneThemeContext } from './scene-theme-context'

const STORAGE_KEY = 'portfolio-scene-theme'

// Stored choice wins; otherwise start from the visitor's local clock.
function readInitialTheme(): SceneThemeId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'morning' || stored === 'noon' || stored === 'sunset' || stored === 'night') {
      return stored
    }
  } catch {
    // localStorage unavailable (private mode) — fall through to time-based.
  }
  return hourToSceneTheme(new Date().getHours())
}

export function SceneThemeProvider({ children }: { children: ReactNode }) {
  const [sceneTheme, setSceneThemeState] = useState<SceneThemeId>(readInitialTheme)

  const setSceneTheme = useCallback((theme: SceneThemeId) => {
    setSceneThemeState(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Ignore persistence failures — session-only choice is fine.
    }
  }, [])

  const cycleSceneTheme = useCallback(() => {
    setSceneThemeState((current) => {
      const next = nextSceneTheme(current)
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Ignore persistence failures.
      }
      return next
    })
  }, [])

  // If the visitor never chose manually we keep following their local time.
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return
    } catch {
      return
    }
    const id = window.setInterval(() => {
      setSceneThemeState((current) => {
        const byTime = hourToSceneTheme(new Date().getHours())
        return byTime === current ? current : byTime
      })
    }, 60_000)
    return () => window.clearInterval(id)
  }, [])

  const value = useMemo(
    () => ({ sceneTheme, setSceneTheme, cycleSceneTheme }),
    [sceneTheme, setSceneTheme, cycleSceneTheme],
  )

  return <SceneThemeContext.Provider value={value}>{children}</SceneThemeContext.Provider>
}
