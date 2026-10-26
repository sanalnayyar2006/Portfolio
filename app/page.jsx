import Interactive3DCube from "../components/interactive-3d-cube"
import CharacterModel from "../components/character-model"
import { Github, Linkedin, Mail, Terminal } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#090a0f] text-[#f1f3f9] flex flex-col justify-between blueprint-grid selection:bg-[#ff5219]/20 selection:text-white">
      {/* Top Header: Clean, Architectural, Focused */}
      <header className="border-b border-[#222634] bg-[#090a0f]/95 px-6 py-4">
        <div className="container mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          {/* Identity & Spec */}
          <div className="flex items-center gap-2 sm:gap-3">
            <CharacterModel className="h-20 sm:h-[84px] w-14 sm:w-16" />
            <div>
              <h1 className="text-xl font-bold font-mono tracking-wider text-[#f1f3f9] uppercase leading-none">
                SANAL NAYYAR
              </h1>
              <p className="text-xs font-mono text-[#7e899b] tracking-wide mt-1">
                SOFTWARE ENGINEER & SYSTEMS BUILDER
              </p>
              <p className="text-xs font-mono text-[#7e899b] tracking-wide mt-1">
                Building AI-powered applications,interactive experiences, and technical business solutions.
              </p>
            </div>
          </div>

          {/* Status & Quick Channels */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#11141c] border border-[#232838] text-[#8a94a6]">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span className="text-[#f1f3f9] font-medium">AVAILABLE FOR WORK</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#12151e] border border-[#222634] text-[#8a94a6] hover:text-[#f1f3f9] hover:border-[#384156] transition-colors"
                title="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#12151e] border border-[#222634] text-[#8a94a6] hover:text-[#f1f3f9] hover:border-[#384156] transition-colors"
                title="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="mailto:sanal.nayyar@example.com"
                className="btn-tactile px-3.5 py-1.5 flex items-center gap-2 cursor-pointer"
                title="Direct Email Dispatch"
              >
                <Mail size={14} className="text-[#ff5219]" />
                <span className="hidden sm:inline">DISPATCH</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Viewport: The Complete Interactive 3D Spatial Cube */}
      <section className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 py-6 flex flex-col justify-center">
        <div className="w-full h-full flex-1">
          <Interactive3DCube />
        </div>
      </section>

      {/* Minimal Footer Stamp */}
      <footer className="border-t border-[#1c202c] bg-[#08090d] px-6 py-3 font-mono text-[11px] text-[#7e899b]">
        <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[#ff5219]">●</span>
            <span>Sanal's PORTFOLIO</span>
            <span className="text-[#3b4356]">//</span>
            <span>India</span>
          </div>

          <div>
            {new Date().getFullYear()} SANAL NAYYAR.
          </div>
        </div>
      </footer>
    </main>
  )
}
