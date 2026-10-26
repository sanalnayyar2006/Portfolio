"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowDown, Github, Linkedin, Mail, Terminal, Box, ChevronRight, Layers } from "lucide-react"
import Interactive3DCube from "./interactive-3d-cube"
import Hero3DScene from "./hero-3d-scene"

export default function Hero() {
  const titleRef = useRef(null)
  const metaRef = useRef(null)
  const descRef = useRef(null)
  const ctaRef = useRef(null)
  const statsRef = useRef(null)

  // 3D Viewport mode: "cube" (default - rotatable persistent 3D cube with 4 content sides) or "polyhedron"
  const [active3DMode, setActive3DMode] = useState("cube")

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import("gsap")

      // Initial state
      gsap.set([metaRef.current, titleRef.current, descRef.current, ctaRef.current, statsRef.current], {
        opacity: 0,
        y: 24,
      })

      // Clean, crisp entrance animation
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } })
      tl.to(metaRef.current, { opacity: 1, y: 0, duration: 0.5 })
        .to(titleRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.2")
        .to(descRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
        .to(statsRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
    }

    loadGSAP()
  }, [])

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen pt-28 pb-16 flex flex-col justify-center bg-[#090a0f] border-b border-[#222634] blueprint-grid">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Top Architectural System Tag */}
        <div ref={metaRef} className="flex flex-wrap items-center justify-between gap-4 mb-8 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#11131a] border border-[#222634] text-[#8a94a6]">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span className="text-[#f1f3f9] font-medium">SANAL NAYYAR</span>
            <span className="text-[#3d465c]">//</span>
            <span>PORTFOLIO v2.5</span>
          </div>

          <div className="flex items-center gap-4 text-[#7e899b]">
            <span className="hidden sm:inline">SPEC: FULL-STACK & 3D INTERACTIVE SYSTEMS</span>
            <span className="px-2 py-0.5 bg-[#151922] border border-[#232734] text-[#ff5219]">
              SYSTEM: ONLINE
            </span>
          </div>
        </div>

        {/* Main Grid: Left Info, Right 3D Viewport */}
        <div className="grid lg:grid-cols-12 gap-8 items-center mb-12">
          {/* Left Column (Information Architecture) */}
          <div className="lg:col-span-6 space-y-6">
            <div ref={titleRef}>
              <div className="inline-flex items-center gap-2 mb-3 text-xs font-mono text-[#ff5219] uppercase tracking-wider">
                <Box size={14} />
                <span>3D Spatial & Full-Stack Systems</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#f1f3f9] uppercase leading-[1.08]">
                Crafting robust <br />
                <span className="text-[#ff5219]">3D & digital</span> systems
              </h1>
            </div>

            <div ref={descRef} className="space-y-4">
              <p className="text-base sm:text-lg text-[#8a94a6] leading-relaxed max-w-xl">
                Full-Stack Software Engineer specializing in real-time WebGL, interactive 3D structures,
                and high-performance distributed web architectures.
              </p>

              {/* Technical Capabilities Badges */}
              <div className="flex flex-wrap gap-2 pt-2 font-mono text-xs">
                {["THREE.JS", "PYTHON", "REACT 19", "TYPESCRIPT", "NEXT.JS 14", "DOCKER"].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 bg-[#11141b] border border-[#242938] text-[#9ca3af]"
                    >
                      {tech}
                    </span>
                  ),
                )}
              </div>
            </div>

            {/* Tactile Call To Actions */}
            <div ref={ctaRef} className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => scrollToSection("projects")}
                className="btn-tactile btn-tactile-primary px-6 py-3.5 text-xs inline-flex items-center gap-2 cursor-pointer"
              >
                <span>EXPLORE WORK [3D]</span>
                <ChevronRight size={14} />
              </button>

              <button
                onClick={() => scrollToSection("contact")}
                className="btn-tactile px-6 py-3.5 text-xs inline-flex items-center gap-2 cursor-pointer"
              >
                <Terminal size={14} className="text-[#ff5219]" />
                <span>DISPATCH MESSAGE</span>
              </button>
            </div>

            {/* 3D Viewport Mode Switcher Pill */}
            <div className="flex items-center gap-3 pt-3 font-mono text-xs">
              <span className="text-[#7e899b] text-[11px] uppercase">3D VIEWPORT:</span>
              <div className="inline-flex p-1 bg-[#11141b] border border-[#232838]">
                <button
                  onClick={() => setActive3DMode("cube")}
                  className={`px-3 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                    active3DMode === "cube"
                      ? "bg-[#ff5219] text-white"
                      : "text-[#8a94a6] hover:text-white"
                  }`}
                >
                  INTERACTIVE CUBE (PERSISTENT)
                </button>
                <button
                  onClick={() => setActive3DMode("polyhedron")}
                  className={`px-3 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                    active3DMode === "polyhedron"
                      ? "bg-[#ff5219] text-white"
                      : "text-[#8a94a6] hover:text-white"
                  }`}
                >
                  WEBGL GEODESIC
                </button>
              </div>
            </div>

            {/* Social Channels (Tactile Badges) */}
            <div className="flex items-center gap-3 pt-1 text-xs font-mono">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#11141b] border border-[#242938] text-[#8a94a6] hover:text-white hover:border-[#3e465e] transition-colors flex items-center gap-2"
              >
                <Github size={14} />
                <span>GITHUB</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#11141b] border border-[#242938] text-[#8a94a6] hover:text-white hover:border-[#3e465e] transition-colors flex items-center gap-2"
              >
                <Linkedin size={14} />
                <span>LINKEDIN</span>
              </a>
              <a
                href="mailto:sanal.nayyar@example.com"
                className="px-3 py-1.5 bg-[#11141b] border border-[#242938] text-[#8a94a6] hover:text-white hover:border-[#3e465e] transition-colors flex items-center gap-2"
              >
                <Mail size={14} />
                <span>EMAIL</span>
              </a>
            </div>
          </div>

          {/* Right Column: 3D Centerpiece Viewport */}
          <div className="lg:col-span-6">
            {active3DMode === "cube" ? <Interactive3DCube /> : <Hero3DScene />}
          </div>
        </div>

        {/* Lower Technical Telemetry Bar */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#0e1017] border border-[#222634] font-mono text-xs"
        >
          <div className="border-l-2 border-[#ff5219] pl-3">
            <div className="text-[#7e899b] text-[10px] uppercase">PRODUCTION EXPERIENCE</div>
            <div className="text-[#f1f3f9] text-base font-bold mt-0.5">5+ YEARS</div>
          </div>

          <div className="border-l-2 border-[#2b3142] pl-3">
            <div className="text-[#7e899b] text-[10px] uppercase">SYSTEM AVAILABILITY</div>
            <div className="text-[#10b981] text-base font-bold mt-0.5">99.98% SLA</div>
          </div>

          <div className="border-l-2 border-[#2b3142] pl-3">
            <div className="text-[#7e899b] text-[10px] uppercase">3D SPATIAL CUBE</div>
            <div className="text-[#ff5219] text-base font-bold mt-0.5">360° PERSISTENT</div>
          </div>

          <div className="border-l-2 border-[#2b3142] pl-3">
            <div className="text-[#7e899b] text-[10px] uppercase">LOCATION & TIMEZONE</div>
            <div className="text-[#f1f3f9] text-base font-bold mt-0.5">SAN FRANCISCO / PST</div>
          </div>
        </div>

        {/* Scroll Down Action */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => scrollToSection("about")}
            className="flex flex-col items-center gap-2 text-[#7e899b] hover:text-[#ff5219] transition-colors font-mono text-xs cursor-pointer group"
          >
            <span className="tracking-widest uppercase text-[10px]">SCROLL TO INSPECT ARCHITECTURE</span>
            <div className="p-1.5 border border-[#2b3142] group-hover:border-[#ff5219] transition-colors">
              <ArrowDown size={14} className="animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    </section>
  )
}
