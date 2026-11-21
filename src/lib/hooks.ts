import { useSyncExternalStore } from 'react'

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
