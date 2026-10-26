"use client"

import { useEffect, useRef, useState } from "react"
import { Terminal, Cpu, Database, Wrench } from "lucide-react"

export default function Skills() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const [activeCategory, setActiveCategory] = useState("all")

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import("gsap")
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")

      gsap.registerPlugin(ScrollTrigger)

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        onEnter: () => {
          const bars = document.querySelectorAll(".tech-meter")
          bars.forEach((bar) => {
            const width = bar.getAttribute("data-width")
            gsap.to(bar, { width: `${width}%`, duration: 1.2, ease: "power2.out" })
          })
        },
      })
    }

    loadGSAP()
  }, [])

  const categories = [
    {
      id: "frontend",
      title: "Frontend & Spatial Graphics",
      icon: <Cpu size={18} className="text-[#ff5219]" />,
      skills: [
        { name: "Three.js / WebGL", level: 92, status: "ADVANCED" },
        { name: "React 19 / Next.js 14", level: 96, status: "CORE" },
        { name: "TypeScript / JavaScript", level: 95, status: "CORE" },
        { name: "Tailwind CSS & Vanilla CSS", level: 94, status: "CORE" },
      ],
    },
    {
      id: "backend",
      title: "Backend & Systems",
      icon: <Database size={18} className="text-[#38bdf8]" />,
      skills: [
        { name: "Node.js / Express", level: 90, status: "CORE" },
        { name: "PostgreSQL & Prisma", level: 86, status: "ADVANCED" },
        { name: "REST & GraphQL APIs", level: 88, status: "ADVANCED" },
        { name: "MongoDB / Redis Caching", level: 82, status: "PROFICIENT" },
      ],
    },
    {
      id: "devops",
      title: "Infrastructure & Tooling",
      icon: <Wrench size={18} className="text-[#10b981]" />,
      skills: [
        { name: "Docker / Containerization", level: 80, status: "PROFICIENT" },
        { name: "Git & CI/CD Pipelines", level: 94, status: "CORE" },
        { name: "AWS Cloud Services", level: 78, status: "PROFICIENT" },
        { name: "Performance Optimization", level: 90, status: "ADVANCED" },
      ],
    },
  ]

  return (
    <section ref={sectionRef} id="skills" className="py-24 bg-[#090a0f] border-b border-[#222634]">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div ref={titleRef} className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#ff5219] uppercase tracking-wider mb-2">
              <Terminal size={14} />
              <span>// 02. TECHNICAL CAPABILITIES MATRIX</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f1f3f9] uppercase">
              Skills & Engineering Disciplines
            </h2>
          </div>

          <div className="font-mono text-xs text-[#7e899b] bg-[#11141b] border border-[#222634] px-3 py-2">
            STACK EVALUATION: <span className="text-[#10b981] font-bold">OPTIMIZED (HIGH PERFORMANCE)</span>
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="panel-matte p-6 border border-[#222634] space-y-6">
              <div className="flex items-center justify-between border-b border-[#1f2432] pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#161a24] border border-[#262c3c]">{cat.icon}</div>
                  <h3 className="font-bold text-[#f1f3f9] text-base uppercase tracking-wide">
                    {cat.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-5">
                {cat.skills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-[#e2e8f0] font-medium">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#7e899b] px-1.5 py-0.5 bg-[#141722] border border-[#242938]">
                          {skill.status}
                        </span>
                        <span className="text-[#ff5219] font-bold">{skill.level}%</span>
                      </div>
                    </div>

                    {/* Industrial Meter (Crisp solid bar, no shiny shimmer) */}
                    <div className="w-full bg-[#151922] h-2 border border-[#242a38] overflow-hidden">
                      <div
                        className="tech-meter bg-[#ff5219] h-full"
                        data-width={skill.level}
                        style={{ width: "0%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
