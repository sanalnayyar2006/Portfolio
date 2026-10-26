"use client"

import { useState, useEffect } from "react"
import { Terminal } from "lucide-react"
import CharacterModel from "./character-model"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-200 bg-[#090a0f] ${
        isScrolled ? "border-b border-[#222634] py-3 shadow-md" : "border-b border-[#1c202c] py-4"
      }`}
    >
      <nav className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo / Identifier */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 font-mono text-sm tracking-wider uppercase text-left group"
          >
            <CharacterModel className="h-14 w-11 sm:h-16 sm:w-12" />
            <div>
              <div className="font-bold text-[#f1f3f9] group-hover:text-[#ff5219] transition-colors leading-none">
                SANAL NAYYAR
              </div>
              <div className="text-[10px] text-[#7e899b] tracking-widest mt-1">
                ENGINEER // 3D STUDIO
              </div>
            </div>
          </button>

          {/* Navigation Links with Monospaced Numerals */}
          <div className="hidden md:flex items-center space-x-6 text-xs font-mono">
            {[
              { id: "about", num: "01", label: "ABOUT" },
              { id: "skills", num: "02", label: "CAPABILITIES" },
              { id: "projects", num: "03", label: "PROJECTS [3D]" },
              { id: "contact", num: "04", label: "CONTACT" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-[#94a3b8] hover:text-[#f1f3f9] transition-colors flex items-center gap-1.5 py-1"
              >
                <span className="text-[#ff5219] text-[10px]">{item.num}.</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollToSection("contact")}
              className="btn-tactile px-4 py-2 text-xs flex items-center gap-2 cursor-pointer"
            >
              <Terminal size={13} className="text-[#ff5219]" />
              <span>TERMINAL CONNECT</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}
