import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

function subscribeScroll(callback: () => void) {
  window.addEventListener('scroll', callback, { passive: true })
  window.addEventListener('resize', callback)
  const observer = new ResizeObserver(callback)
  observer.observe(document.body)
  return () => {
    window.removeEventListener('scroll', callback)
    window.removeEventListener('resize', callback)
    observer.disconnect()
  }
}

export function useScrolled(threshold = 8) {
  return useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > threshold,
    () => false,
  )
}

function getSnapshotFor(ids: string[], offset: number) {
  if (typeof document === 'undefined') return ids[0] ?? ''
  const position = window.scrollY + offset
  let current = ids[0] ?? ''
  for (const id of ids) {
    const el = document.getElementById(id)
    if (el && el.offsetTop <= position) current = id
  }
  const atBottom = window.scrollY > 0 && window.scrollY + window.innerHeight >= document.body.scrollHeight - 4
  if (atBottom) {
    current = ids[ids.length - 1] ?? current
  }
  return current
}

export function useScrollSpy(ids: string[], offset = 120) {
  return useSyncExternalStore(
    subscribeScroll,
    () => getSnapshotFor(ids, offset),
    () => ids[0] ?? '',
  )
}

export type CopyStatus = 'idle' | 'copied' | 'error'

function fallbackCopy(value: string) {
  const field = document.createElement('textarea')
  field.value = value
  field.setAttribute('readonly', '')
  field.style.position = 'fixed'
  field.style.top = '-1000px'
  field.style.opacity = '0'
  document.body.appendChild(field)
  field.select()
  let copied = false
  try {
    copied = document.execCommand('copy')
  } catch {
    copied = false
  }
  field.remove()
  return copied
}

export function useCopyToClipboard(resetAfter = 1600) {
  const [status, setStatus] = useState<CopyStatus>('idle')
  const timerRef = useRef(0)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const copy = useCallback(
    async (value: string) => {
      let copied = false
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value)
          copied = true
        }
      } catch {
        copied = false
      }
      if (!copied) copied = fallbackCopy(value)
      window.clearTimeout(timerRef.current)
      setStatus(copied ? 'copied' : 'error')
      timerRef.current = window.setTimeout(() => setStatus('idle'), resetAfter)
      return copied
    },
    [resetAfter],
  )

  return { copy, status }
}
