"use client"

import { useEffect, useRef } from "react"
import { Code, Layers, Cpu, ShieldCheck } from "lucide-react"

export default function About() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const textRef = useRef(null)
  const cardsRef = useRef(null)

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import("gsap")
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")

      gsap.registerPlugin(ScrollTrigger)

      gsap.set([titleRef.current, textRef.current], { opacity: 0, y: 30 })
      gsap.set(cardsRef.current?.children || [], { opacity: 0, y: 20 })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 85%",
        onEnter: () => {
          const tl = gsap.timeline()
          tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
            .to(textRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.3")
            .to(
              cardsRef.current?.children || [],
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
                stagger: 0.15,
              },
              "-=0.3",
            )
        },
      })
    }

    loadGSAP()
  }, [])

  const capabilities = [
    {
      icon: <Code size={20} className="text-[#ff5219]" />,
      title: "Clean Systems Architecture",
      code: "ARCH.01",
      desc: "Robust, decoupled, and maintainable software design using strict TypeScript contracts and resilient patterns.",
    },
    {
      icon: <Layers size={20} className="text-[#38bdf8]" />,
      title: "Real-Time 3D & Graphics",
      code: "GFX.02",
      desc: "WebGL, Three.js shaders, custom math curves, and 60fps GPU-accelerated interactive canvas viewports.",
    },
    {
      icon: <Cpu size={20} className="text-[#10b981]" />,
      title: "High-Throughput Performance",
      code: "PERF.03",
      desc: "Zero-bloat bundling, sub-millisecond execution times, lazy asset pipelines, and optimal browser rendering.",
    },
  ]

  return (
    <section ref={sectionRef} id="about" className="py-24 bg-[#0a0c12] border-b border-[#222634]">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div ref={titleRef} className="mb-14">
          <div className="flex items-center gap-2 font-mono text-xs text-[#ff5219] uppercase tracking-wider mb-2">
            <span>// 01. CORE DOSSIER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f1f3f9] uppercase">
            Engineering Background & Philosophy
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Text Narrative */}
          <div ref={textRef} className="lg:col-span-6 space-y-6">
            <div className="panel-matte p-6 border border-[#222634] space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#7e899b] border-b border-[#1f2432] pb-3">
                <span className="text-[#f1f3f9] font-semibold">BIO // PROFILE SPEC</span>
                <span>STATUS: ACTIVE</span>
              </div>

              <p className="text-base text-[#8a94a6] leading-relaxed">
                I am a full-stack software engineer with 5+ years of experience engineering high-performance web
                applications and real-time 3D spatial web environments. My focus bridges deep backend logic with
                meticulously crafted interactive user interfaces.
              </p>

              <p className="text-base text-[#8a94a6] leading-relaxed">
                Rather than relying on superficial glossy effects or generic templates, I build software around
                purposeful typography, mathematical precision, crisp contrast, and tactile physical feedback.
              </p>
            </div>

            {/* Core Stack Matrix */}
            <div className="p-5 bg-[#0e1017] border border-[#222634]">
              <div className="text-xs font-mono text-[#7e899b] mb-3 flex items-center justify-between">
                <span>PRIMARY PRODUCTION STACK</span>
                <span className="text-[#10b981]">VERIFIED</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
                {[
                  "Three.js / WebGL",
                  "Next.js 14 / App",
                  "TypeScript 5",
                  "Node.js / Express",
                  "PostgreSQL / Prisma",
                  "Tailwind CSS v4",
                ].map((tech) => (
                  <div
                    key={tech}
                    className="p-2 bg-[#12151d] border border-[#1f2432] text-[#d1d5db] flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-[#ff5219]" />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Pillar Cards */}
          <div ref={cardsRef} className="lg:col-span-6 space-y-4">
            {capabilities.map((cap) => (
              <div
                key={cap.code}
                className="panel-matte panel-matte-hover p-6 border border-[#222634] transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#161a24] border border-[#262c3c]">{cap.icon}</div>
                    <h3 className="text-lg font-bold text-[#f1f3f9] uppercase tracking-wide">
                      {cap.title}
                    </h3>
                  </div>
                  <span className="font-mono text-xs px-2 py-0.5 bg-[#141720] border border-[#232734] text-[#ff5219]">
                    {cap.code}
                  </span>
                </div>
                <p className="text-sm text-[#8a94a6] leading-relaxed pl-11">{cap.desc}</p>
              </div>
            ))}

            <div className="p-4 bg-[#11131a] border border-dashed border-[#2b3142] flex items-center gap-3 text-xs font-mono text-[#8a94a6]">
              <ShieldCheck size={18} className="text-[#10b981] shrink-0" />
              <span>Full compliance with accessible contrast ratios, semantic HTML5, and low-latency rendering.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
