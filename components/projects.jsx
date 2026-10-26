"use client"

import { useState, useRef } from "react"
import { ExternalLink, Github, Box, Layers, ArrowUpRight } from "lucide-react"

function Project3DCard({ project, index }) {
  const cardRef = useRef(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Calculate rotation (-10 to 10 degrees)
    const rotX = ((mouseY / height) - 0.5) * -16
    const rotY = ((mouseX / width) - 0.5) * 16

    setRotate({ x: rotX, y: rotY })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotate({ x: 0, y: 0 })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
      }}
      className="group relative"
    >
      <div
        style={{
          transform: isHovered
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateY(-4px)`
            : "rotateX(0deg) rotateY(0deg) translateY(0px)",
          transformStyle: "preserve-3d",
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
        }}
        className="panel-matte p-5 border border-[#222634] group-hover:border-[#384156] transition-colors"
      >
        {/* Card Header Metadata */}
        <div className="flex items-center justify-between text-xs font-mono text-[#7e899b] border-b border-[#1f2432] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[#ff5219] font-bold">PROJECT {String(index + 1).padStart(2, "0")}</span>
            <span>//</span>
            <span className="text-[#a0aec0]">{project.category}</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 bg-[#161a24] border border-[#262c3c] text-[#8a94a6]">
            3D SPATIAL TILT
          </span>
        </div>

        {/* Image Viewport with 3D Depth */}
        <div
          style={{ transform: "translateZ(20px)" }}
          className="relative h-48 w-full overflow-hidden border border-[#232838] bg-[#12151d] mb-5"
        >
          <img
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
          />
          <div className="absolute inset-0 bg-[#090a0f]/40 pointer-events-none group-hover:opacity-0 transition-opacity" />

          {/* Technical overlay badge */}
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#090a0f]/90 border border-[#232838] font-mono text-[10px] text-[#ff5219]">
            [SYS.RENDER]
          </div>
        </div>

        {/* Content with Depth */}
        <div style={{ transform: "translateZ(30px)" }} className="space-y-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-bold text-[#f1f3f9] uppercase tracking-wide group-hover:text-[#ff5219] transition-colors">
              {project.title}
            </h3>
            <ArrowUpRight size={18} className="text-[#7e899b] group-hover:text-[#ff5219] transition-colors shrink-0 mt-1" />
          </div>

          <p className="text-sm text-[#8a94a6] leading-relaxed line-clamp-3">
            {project.description}
          </p>

          {/* Tech Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[11px]">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 bg-[#141722] border border-[#222838] text-[#9ca3af]"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-[#1f2432]">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tactile flex-1 py-2 text-xs flex items-center justify-center gap-2"
            >
              <Github size={14} />
              <span>SOURCE</span>
            </a>
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tactile btn-tactile-primary flex-1 py-2 text-xs flex items-center justify-center gap-2"
            >
              <ExternalLink size={14} />
              <span>LIVE DEMO</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const projects = [
    {
      title: "E-Commerce Architecture Platform",
      category: "FULL-STACK / COMMERCE",
      description:
        "Engineered full-stack transactional commerce system with sub-100ms API response times, PostgreSQL ACID guarantees, and automated order fulfillment pipelines.",
      image: "/modern-ecommerce-interface.png",
      tech: ["React 19", "Node.js", "PostgreSQL", "Stripe API"],
      github: "https://github.com",
      live: "https://example.com",
    },
    {
      title: "Real-Time Task Collab Matrix",
      category: "DISTRIBUTED WORKFLOW",
      description:
        "High-concurrency collaborative workspace utilizing WebSockets for real-time team synchronization, state conflict resolution, and granular event tracking.",
      image: "/task-management-dashboard.png",
      tech: ["Next.js 14", "Socket.io", "MongoDB", "Tailwind"],
      github: "https://github.com",
      live: "https://example.com",
    },
    {
      title: "Spatial Weather & Sensor Telemetry",
      category: "DATA VISUALIZATION / 3D",
      description:
        "High-density meteorological visualization engine consuming satellite feeds with real-time vector charting, historical trend analysis, and GPU-assisted shaders.",
      image: "/weather-analytics-dashboard-with-charts.jpg",
      tech: ["Three.js", "D3.js", "Python Fast-API", "WebSockets"],
      github: "https://github.com",
      live: "https://example.com",
    },
  ]

  return (
    <section id="projects" className="py-24 bg-[#0a0c12] border-b border-[#222634] blueprint-grid-dense">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#ff5219] uppercase tracking-wider mb-2">
              <Layers size={14} />
              <span>// 03. PRODUCTION PROJECTS [3D PERSPECTIVE]</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f1f3f9] uppercase">
              Featured Systems & Deployments
            </h2>
          </div>

          <div className="font-mono text-xs text-[#7e899b] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff5219]" />
            <span>INTERACTIVE: HOVER TO ENGAGE 3D PERSPECTIVE PARALLAX</span>
          </div>
        </div>

        {/* 3D Tilt Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Project3DCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
