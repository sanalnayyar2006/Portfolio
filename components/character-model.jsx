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
  const rectRef = useRef(null)
  const pointerPosRef = useRef({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const handlePointerEnter = () => {
    if (containerRef.current) {
      rectRef.current = containerRef.current.getBoundingClientRect()
    }
    setIsHovered(true)
  }

  const handlePointerMove = (e) => {
    const rect = rectRef.current || containerRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0 || rect.height === 0) return
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
    pointerPosRef.current.x = Math.max(-1, Math.min(1, x))
    pointerPosRef.current.y = Math.max(-1, Math.min(1, y))
  }

  const handlePointerLeave = () => {
    setIsHovered(false)
    pointerPosRef.current.x = 0
    pointerPosRef.current.y = 0
    rectRef.current = null
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
        <CharacterSceneCanvas isHovered={isHovered} pointerPosRef={pointerPosRef} />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-[#ff5219]" />
        </div>
      )}
    </div>
  )
}
