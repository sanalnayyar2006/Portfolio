"use client"

import React, { useRef, useState, useEffect } from "react"
import dynamic from "next/dynamic"

// Dynamically import the WebGL Canvas component with SSR disabled
const CharacterSceneCanvas = dynamic(
  () => import("./character-scene-canvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <span className="w-1.5 h-1.5 bg-[#ff5219] animate-pulse" />
      </div>
    ),
  }
)

/**
 * Reusable Full-Model Character Component
 * Renders the full 3D character model directly in the header section
 * to the left of the Name, without a restrictive logo box.
 */
export default function CharacterModel({
  className = "h-20 sm:h-[84px] w-14 sm:w-16",
  onClick,
}) {
  const containerRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 })
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const handlePointerMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
    setPointerPos({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    })
  }

  const handlePointerEnter = () => {
    setIsHovered(true)
  }

  const handlePointerLeave = () => {
    setIsHovered(false)
    setPointerPos({ x: 0, y: 0 })
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      className={`relative bg-transparent flex items-center justify-center flex-shrink-0 select-none cursor-pointer group ${className}`}
      title="Sanal Nayyar — 3D Avatar"
    >
      {hasMounted ? (
        <CharacterSceneCanvas isHovered={isHovered} pointerPos={pointerPos} />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-[#ff5219]" />
        </div>
      )}
    </div>
  )
}
