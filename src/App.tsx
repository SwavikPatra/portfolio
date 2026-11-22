import { useEffect } from 'react'
import { ReadModeProvider } from './theme/ReadModeContext'
import Hero from './components/Hero'
import TopBar from './components/TopBar'
import SceneBackground from './scene/SceneBackground'
import About from './sections/About'
import Contact from './sections/Contact'
import Experience from './sections/Experience'
import Skills from './sections/Skills'
import Work from './sections/Work'
import { profile } from './data/profile'

const YEAR = new Date().getFullYear()

function ScrollToHash() {
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView()
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  return null
}

export default function App() {
  return (
    <ReadModeProvider>
      <ScrollToHash />
      <SceneBackground />
      <div className="app">
        <TopBar />

        <main>
          <Hero />
          <Work />
          <About />
          <Skills />
          <Experience />
          <Contact />
        </main>

        <footer className="site-footer">
          <div className="shell site-footer-inner">
            <span>
              © {YEAR} {profile.fullName}
            </span>
            <span>{profile.location}</span>
          </div>
        </footer>
      </div>
    </ReadModeProvider>
  )
}
