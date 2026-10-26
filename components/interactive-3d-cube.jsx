"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Layers,
  Terminal,
  Database,
  Cpu,
  RotateCcw,
  Compass,
  ArrowUpRight,
  Code2,
  Box,
} from "lucide-react"

export default function Interactive3DCube() {
  // Current rotation state in degrees - loads with Name face prominent in front
  const [rotation, setRotation] = useState({ x: -10, y: 44 })
  const [isDragging, setIsDragging] = useState(false)
  const [activeFace, setActiveFace] = useState("name")

  // Refs for tracking drag physics without unnecessary re-renders
  const stateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    rotX: -10,
    rotY: 12,
    velX: 0,
    velY: 0,
    animationFrameId: null,
  })

  // Synchronize stateRef with rotation state
  useEffect(() => {
    stateRef.current.rotX = rotation.x
    stateRef.current.rotY = rotation.y
  }, [rotation])

  // Mouse / Touch Drag Handlers
  const handlePointerDown = (e) => {
    // If clicking an interactive button or link, don't initiate drag
    if (e.target.closest("a, button, input, textarea")) return

    setIsDragging(true)
    stateRef.current.isDragging = true
    stateRef.current.startX = e.clientX
    stateRef.current.startY = e.clientY
    stateRef.current.lastX = e.clientX
    stateRef.current.lastY = e.clientY
    stateRef.current.velX = 0
    stateRef.current.velY = 0

    if (stateRef.current.animationFrameId) {
      cancelAnimationFrame(stateRef.current.animationFrameId)
    }
  }

  const handlePointerMove = useCallback((e) => {
    if (!stateRef.current.isDragging) return

    const deltaX = e.clientX - stateRef.current.lastX
    const deltaY = e.clientY - stateRef.current.lastY

    stateRef.current.lastX = e.clientX
    stateRef.current.lastY = e.clientY

    // Track instantaneous velocity for gentle release glide
    stateRef.current.velY = deltaX * 0.35
    stateRef.current.velX = -deltaY * 0.35

    stateRef.current.rotY += deltaX * 0.45
    stateRef.current.rotX -= deltaY * 0.45

    // Clamp X rotation slightly to prevent inverted gimbal lock flip
    stateRef.current.rotX = Math.max(-85, Math.min(85, stateRef.current.rotX))

    setRotation({
      x: Math.round(stateRef.current.rotX),
      y: Math.round(stateRef.current.rotY),
    })
    setActiveFace("custom")
  }, [])

  const handlePointerUp = useCallback(() => {
    if (!stateRef.current.isDragging) return
    stateRef.current.isDragging = false
    setIsDragging(false)

    // Gentle momentum release that smoothly halts and STAYS at final position
    const applyFriction = () => {
      if (
        Math.abs(stateRef.current.velX) > 0.05 ||
        Math.abs(stateRef.current.velY) > 0.05
      ) {
        stateRef.current.rotX += stateRef.current.velX
        stateRef.current.rotY += stateRef.current.velY

        // Friction damping
        stateRef.current.velX *= 0.88
        stateRef.current.velY *= 0.88

        stateRef.current.rotX = Math.max(-85, Math.min(85, stateRef.current.rotX))

        setRotation({
          x: Math.round(stateRef.current.rotX),
          y: Math.round(stateRef.current.rotY),
        })

        stateRef.current.animationFrameId = requestAnimationFrame(applyFriction)
      } else {
        // Firm stop: Cube stays EXACTLY where user released it
        setRotation({
          x: Math.round(stateRef.current.rotX),
          y: Math.round(stateRef.current.rotY),
        })
      }
    }

    stateRef.current.animationFrameId = requestAnimationFrame(applyFriction)
  }, [])

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
      if (stateRef.current.animationFrameId) {
        cancelAnimationFrame(stateRef.current.animationFrameId)
      }
    }
  }, [handlePointerMove, handlePointerUp])

  // Snap to specific side helper
  const snapToSide = (side) => {
    setActiveFace(side)
    let targetX = 0
    let targetY = 0

    switch (side) {
      case "name": // Face 1 (Front: Name Side)
        targetX = 0
        targetY = 0
        break
      case "tech": // Face 2 (Right: Tech Stack)
        targetX = 0
        targetY = -90
        break
      case "projects": // Face 3 (Back: Projects)
        targetX = 0
        targetY = -180
        break
      case "socials": // Face 4 (Left: Socials)
        targetX = 0
        targetY = 90
        break
      case "reset":
        targetX = -6
        targetY = 12
        setActiveFace("name")
        break
      default:
        break
    }

    stateRef.current.rotX = targetX
    stateRef.current.rotY = targetY
    stateRef.current.velX = 0
    stateRef.current.velY = 0
    setRotation({ x: targetX, y: targetY })
  }

  // 17 Technologies requested by user
  const techStackList = [
    { name: "Python", category: "LANG" },
    { name: "Three.js", category: "3D/GFX" },
    { name: "DBMS (Mongo, SQL, MySQL)", category: "DATA" },
    { name: "Node.js", category: "BACKEND" },
    { name: "Express", category: "BACKEND" },
    { name: "JavaScript", category: "LANG" },
    { name: "TypeScript", category: "LANG" },
    { name: "HTML", category: "CORE" },
    { name: "CSS", category: "CORE" },
    { name: "Figma", category: "DESIGN" },
    { name: "React", category: "FRONTEND" },
    { name: "Unity", category: "ENGINE" },
    { name: "NumPy & Pandas", category: "DATA/AI" },
    { name: "Tailwind CSS", category: "FRONTEND" },
    { name: "Firebase", category: "CLOUD" },
    { name: "Supabase", category: "CLOUD" },
    { name: "Docker", category: "DEVOPS" },
  ]

  // Dimension: Cube half-size is 190px (380px cube)
  const halfSize = 190

  return (
    <div className="relative w-full h-full min-h-[580px] lg:min-h-[660px] panel-matte border border-[#222634] overflow-hidden select-none bg-[#090a0f] flex flex-col justify-between">
      {/* Top Technical Telemetry Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e1017] border-b border-[#222634] text-xs font-mono text-[#8a94a6] z-30">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-[#ff5219] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#ff5219] animate-pulse" />
            3D SPATIAL CUBE
          </div>
          <span className="text-[#3b4356]">|</span>
          <span className="hidden sm:inline text-[11px] text-[#7e899b]">
            PERSISTENT 360° ARTIFACT
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <div className="hidden sm:block">
            STATUS:{" "}
            <span className="text-[#10b981] font-semibold">
              {isDragging ? "ROTATING" : "LOCKED AT POSITION"}
            </span>
          </div>
          <div className="px-2 py-0.5 bg-[#151822] border border-[#232838] text-[#f1f3f9]">
            X: {rotation.x}° | Y: {rotation.y}°
          </div>
        </div>
      </div>

      {/* Center 3D Scene Viewport */}
      <div
        onPointerDown={handlePointerDown}
        className="w-full flex-1 flex items-center justify-center blueprint-grid cursor-grab active:cursor-grabbing relative py-12"
        style={{ perspective: "1200px" }}
      >
        {/* Subtle 3D background guide circles */}
        <div className="absolute w-[460px] h-[460px] rounded-full border border-dashed border-[#1e2330] pointer-events-none" />
        <div className="absolute w-[560px] h-[560px] rounded-full border border-[#171b26] pointer-events-none" />

        {/* The 3D Cube Container */}
        <div
          style={{
            width: `${halfSize * 2}px`,
            height: `${halfSize * 2}px`,
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: isDragging ? "none" : "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className="relative"
        >
          {/* ========================================================= */}
          {/* FACE 1: FRONT -> NAME & IDENTITY (FIRST SIDE ON LOAD)     */}
          {/* ========================================================= */}
          <div
            style={{
              transform: `translateZ(${halfSize}px)`,
              width: `${halfSize * 2}px`,
              height: `${halfSize * 2}px`,
            }}
            className="absolute inset-0 bg-[#0e1119] border-2 border-[#2b3244] p-6 flex flex-col justify-between shadow-2xl backface-visible"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between border-b border-[#202636] pb-2 mb-3">
                <span className="text-[11px] font-mono text-[#ff5219] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#ff5219]" />
                  ENGINEERING PROFILE
                </span>
                <span className="text-[10px] font-mono text-[#10b981] flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  ACTIVE
                </span>
              </div>
            </div>

            {/* Core Content */}
            <div className="my-auto space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-[#f1f3f9] leading-snug">
                Building software from<br />
                <span className="text-[#ff5219]">architecture to deployment.</span>
              </h3>

              <div className="pt-1">
                <div className="text-[11px] font-mono text-[#7e899b] uppercase tracking-wider mb-2 font-semibold">
                  FOCUS
                </div>
                <ul className="space-y-2 font-mono text-xs sm:text-[13px] text-[#d1d5db]">
                  <li className="flex items-center gap-2">
                    <span className="text-[#ff5219] text-sm leading-none">•</span>
                    <span>Scalable Systems</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#ff5219] text-sm leading-none">•</span>
                    <span>Technical Business Solutions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#ff5219] text-sm leading-none">•</span>
                    <span>AI Integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#ff5219] text-sm leading-none">•</span>
                    <span>Interactive Interfaces</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer status */}
            <div className="pt-2 border-t border-[#1c2230] flex items-center justify-between text-[10px] font-mono text-[#7e899b]">
              <span>India</span>
              <span className="text-[#ff5219] font-semibold">[DRAG TO ROTATE 360°]</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* FACE 2: RIGHT -> TECH STACK                               */}
          {/* ========================================================= */}
          <div
            style={{
              transform: `rotateY(90deg) translateZ(${halfSize}px)`,
              width: `${halfSize * 2}px`,
              height: `${halfSize * 2}px`,
            }}
            className="absolute inset-0 bg-[#0e1119] border-2 border-[#2b3244] p-4 flex flex-col justify-between shadow-2xl backface-visible"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#202636] pb-2 mb-2">
                <span className="text-[11px] font-mono text-[#ff5219] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#ff5219]" />
                  ENGINEERING STACK
                </span>
                <span className="text-[10px] font-mono text-[#10b981] font-semibold">17 TECHNOLOGIES</span>
              </div>
              <h4 className="text-base font-bold text-[#f1f3f9] uppercase tracking-wide">
                Core Production Stack
              </h4>
            </div>

            {/* Complete 17 Tech Items Grid */}
            <div className="grid grid-cols-2 gap-1.5 overflow-y-auto max-h-[240px] pr-1 py-1 font-mono text-[10px]">
              {techStackList.map((tech) => (
                <div
                  key={tech.name}
                  className="px-2 py-1 bg-[#131722] border border-[#232a3a] text-[#d1d5db] flex items-center justify-between hover:border-[#ff5219] transition-colors"
                >
                  <span className="truncate font-medium">{tech.name}</span>
                  <span className="text-[8px] text-[#ff5219] px-1 bg-[#181d2c] shrink-0 ml-1">
                    {tech.category}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#1c2230] flex items-center justify-between text-[10px] font-mono text-[#7e899b]">
              <span>POLYGLOT & FULL-STACK</span>
              <span className="text-[#10b981]">VERIFIED</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* FACE 3: BACK -> FEATURED PROJECTS                         */}
          {/* ========================================================= */}
          <div
            style={{
              transform: `rotateY(180deg) translateZ(${halfSize}px)`,
              width: `${halfSize * 2}px`,
              height: `${halfSize * 2}px`,
            }}
            className="absolute inset-0 bg-[#0e1119] border-2 border-[#2b3244] p-5 flex flex-col justify-between shadow-2xl backface-visible"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#202636] pb-2 mb-2">
                <span className="text-[11px] font-mono text-[#ff5219] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#ff5219]" />
                  PROJECTS
                </span>
                <span className="text-[10px] font-mono text-[#7e899b]">SYSTEMS</span>
              </div>
              <h4 className="text-base font-bold text-[#f1f3f9] uppercase tracking-wide">
                ENGINEERING SYSTEMS
              </h4>
            </div>

            {/* Projects list */}
            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-2.5 bg-[#131722] border border-[#232a3a]">
                <div className="flex items-center justify-between text-[#f1f3f9] font-semibold text-[11px]">
                  <span>01. E-COMMERCE PLATFORM</span>
                  <span className="text-[9px] text-[#ff5219]">POSTGRES</span>
                </div>
                <p className="text-[10px] text-[#8a94a6] mt-1 line-clamp-1">
                  High-throughput transactional engine with Stripe & Next.js.
                </p>
              </div>

              <div className="p-2.5 bg-[#131722] border border-[#232a3a]">
                <div className="flex items-center justify-between text-[#f1f3f9] font-semibold text-[11px]">
                  <span>02. TASK COLLAB MATRIX</span>
                  <span className="text-[9px] text-[#38bdf8]">SOCKET.IO</span>
                </div>
                <p className="text-[10px] text-[#8a94a6] mt-1 line-clamp-1">
                  Real-time multi-tenant collaboration workspace.
                </p>
              </div>

              <div className="p-2.5 bg-[#131722] border border-[#232a3a]">
                <div className="flex items-center justify-between text-[#f1f3f9] font-semibold text-[11px]">
                  <span>03. 3D WEATHER TELEMETRY</span>
                  <span className="text-[9px] text-[#10b981]">THREE.JS</span>
                </div>
                <p className="text-[10px] text-[#8a94a6] mt-1 line-clamp-1">
                  GPU-assisted geospatial visualization & shaders.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1c2230] flex items-center justify-between text-[10px] font-mono text-[#7e899b]">
              <span>CODEBASE: REPRODUCIBLE</span>
              <span className="text-[#ff5219]">READY</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* FACE 4: LEFT -> CHANNELS & SOCIALS                        */}
          {/* ========================================================= */}
          <div
            style={{
              transform: `rotateY(-90deg) translateZ(${halfSize}px)`,
              width: `${halfSize * 2}px`,
              height: `${halfSize * 2}px`,
            }}
            className="absolute inset-0 bg-[#0e1119] border-2 border-[#2b3244] p-5 flex flex-col justify-between shadow-2xl backface-visible"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#202636] pb-2 mb-2">
                <span className="text-[11px] font-mono text-[#ff5219] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#ff5219]" />
                  SOCIALS & COMMUNICATION CHANNELS
                </span>
                <span className="text-[10px] font-mono text-[#7e899b]">CONNECT</span>
              </div>
              <h4 className="text-base font-bold text-[#f1f3f9] uppercase tracking-wide">
                Direct Channels
              </h4>
            </div>

            {/* Social Links */}
            <div className="space-y-3 my-auto">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#141824] border border-[#252c3e] hover:border-[#ff5219] hover:bg-[#1a2030] transition-colors flex items-center justify-between text-xs font-mono group"
              >
                <div className="flex items-center gap-2.5 text-[#f1f3f9]">
                  <Github size={17} className="text-[#ff5219]" />
                  <span className="font-semibold">GITHUB</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#7e899b] group-hover:text-[#ff5219]">
                  <span>@sanalnayyar</span>
                  <ArrowUpRight size={13} />
                </div>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#141824] border border-[#252c3e] hover:border-[#ff5219] hover:bg-[#1a2030] transition-colors flex items-center justify-between text-xs font-mono group"
              >
                <div className="flex items-center gap-2.5 text-[#f1f3f9]">
                  <Linkedin size={17} className="text-[#38bdf8]" />
                  <span className="font-semibold">LINKEDIN</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#7e899b] group-hover:text-[#38bdf8]">
                  <span>/in/sanal-nayyar</span>
                  <ArrowUpRight size={13} />
                </div>
              </a>

              <a
                href="mailto:sanal.nayyar@example.com"
                className="p-3 bg-[#141824] border border-[#252c3e] hover:border-[#10b981] hover:bg-[#1a2030] transition-colors flex items-center justify-between text-xs font-mono group"
              >
                <div className="flex items-center gap-2.5 text-[#f1f3f9]">
                  <Mail size={17} className="text-[#10b981]" />
                  <span className="font-semibold">EMAIL</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#7e899b] group-hover:text-[#10b981]">
                  <span>DISPATCH</span>
                  <ArrowUpRight size={13} />
                </div>
              </a>
            </div>

            <div className="pt-2 border-t border-[#1c2230] flex items-center justify-between text-[10px] font-mono text-[#7e899b]">
              <span>COMMUNICATION: ACTIVE</span>
              <span className="text-[#10b981]">24H RESPONSE</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* FACE 5: TOP -> METRICS & SLA                              */}
          {/* ========================================================= */}
          <div
            style={{
              transform: `rotateX(90deg) translateZ(${halfSize}px)`,
              width: `${halfSize * 2}px`,
              height: `${halfSize * 2}px`,
            }}
            className="absolute inset-0 bg-[#0c0e16] border-2 border-[#2b3244] p-5 flex flex-col justify-between shadow-2xl backface-visible"
          >
            <div className="flex items-center justify-between border-b border-[#1f2536] pb-2">
              <span className="text-[10px] font-mono text-[#ff5219]">TOP ELEVATION</span>
              <span className="text-[10px] font-mono text-[#7e899b]">METRICS.SLA</span>
            </div>

            <div className="space-y-3 font-mono text-xs my-auto">
              <div className="p-2.5 bg-[#131722] border border-[#232a3a] flex items-center justify-between">
                <span className="text-[#8a94a6] text-[11px]">EXPERIENCE</span>
                <span className="text-[#f1f3f9] font-bold text-xs">5+ YEARS PROD</span>
              </div>
              <div className="p-2.5 bg-[#131722] border border-[#232a3a] flex items-center justify-between">
                <span className="text-[#8a94a6] text-[11px]">SYSTEM SLA</span>
                <span className="text-[#10b981] font-bold text-xs">99.98% UPTIME</span>
              </div>
            </div>

            <div className="text-center text-[9px] font-mono text-[#525c72]">
              SPATIAL 3D ENGINE
            </div>
          </div>

          {/* ========================================================= */}
          {/* FACE 6: BOTTOM -> BASE ELEVATION (CLEANED)                */}
          {/* ========================================================= */}
          <div
            style={{
              transform: `rotateX(-90deg) translateZ(${halfSize}px)`,
              width: `${halfSize * 2}px`,
              height: `${halfSize * 2}px`,
            }}
            className="absolute inset-0 bg-[#0c0e16] border-2 border-[#2b3244] p-5 flex flex-col justify-between shadow-2xl backface-visible"
          >
            <div className="flex items-center justify-between border-b border-[#1f2536] pb-2">
              <span className="text-[10px] font-mono text-[#ff5219]">Had to put up something </span>
              <span className="text-[10px] font-mono text-[#7e899b]">Error: 404</span>
            </div>

            <div className="text-center my-auto font-mono text-xs text-[#8a94a6] space-y-1.5">
              <div className="text-[#f1f3f9] font-bold tracking-wider">Let's connect?</div>
              <div className="text-[11px] text-[#7e899b]">Connect through social links</div>
              <div className="text-[#ff5219] text-[10px] mt-1">India, Himachal Pradesh </div>
            </div>

            <div className="text-center text-[9px] font-mono text-[#525c72]">
              SYSTEM RUNTIME: Matters in this?
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Quick Snap Navigation Bar (Bottom HUD) */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#0e1017] border-t border-[#222634] text-xs font-mono z-30">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[#7e899b] text-[10px] uppercase tracking-wider mr-1 hidden sm:inline">
            FACETS:
          </span>
          {[
            { id: "name", label: "01. NAME" },
            { id: "tech", label: "02. TECH STACK" },
            { id: "projects", label: "03. PROJECTS" },
            { id: "socials", label: "04. SOCIALS" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => snapToSide(item.id)}
              className={`px-3 py-1.5 text-[11px] font-semibold border transition-all cursor-pointer ${activeFace === item.id
                  ? "bg-[#ff5219] text-white border-[#ff6e3d]"
                  : "bg-[#141822] text-[#94a3b8] border-[#252b3b] hover:border-[#3d465c] hover:text-white"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#7e899b] hidden md:inline">
            CLICK & DRAG 360° // STAYS AT POSITION ON RELEASE
          </span>
          <button
            onClick={() => snapToSide("reset")}
            className="px-3 py-1.5 text-[11px] font-semibold border bg-[#141822] text-[#94a3b8] border-[#252b3b] hover:text-white hover:border-[#3d465c] flex items-center gap-1.5 cursor-pointer"
            title="Reset to default Name side"
          >
            <RotateCcw size={12} />
            <span>RESET TO Engineering Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}
