"use client"

import React, { useRef, useEffect, useMemo, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF, useAnimations } from "@react-three/drei"
import * as THREE from "three"
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js"

const MODEL_PATH = "/model/model.glb"

// Preload the GLB model in browser
useGLTF.preload(MODEL_PATH)

function SceneContent({ isHovered, pointerPos, pointerPosRef }) {
  const { scene, animations } = useGLTF(MODEL_PATH)
  const groupRef = useRef(null)
  const { camera, size: canvasSize } = useThree()
  const [modelBounds, setModelBounds] = useState({ size: new THREE.Vector3(0.5, 1.3, 0.2), center: new THREE.Vector3() })

  // References to lights for smooth hover transitions
  const keyLightRef = useRef(null)
  const rimLightRef = useRef(null)
  const groundRingRef = useRef(null)

  // Clone skeleton hierarchy so meshes and bones are properly bound
  const clonedScene = useMemo(() => {
    if (!scene) return null
    const cloned = cloneSkeleton(scene)
    cloned.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true
        node.receiveShadow = true
        if (node.material) {
          node.material.roughness = Math.max(node.material.roughness || 0, 0.35)
        }
      }
    })
    return cloned
  }, [scene])

  // Play animation if present in GLB (loop idle)
  const { actions, names } = useAnimations(animations, groupRef)
  useEffect(() => {
    if (names && names.length > 0) {
      const idleClip =
        names.find((n) => n.toLowerCase().includes("idle")) || names[0]
      const action = actions[idleClip]
      if (action) {
        action.reset().fadeIn(0.2).play()
        action.setLoop(THREE.LoopRepeat, Infinity)
      }
      return () => action?.fadeOut(0.2)
    }
  }, [actions, names])

  // Store bone references for head and upper body tracking
  const bonesRef = useRef({
    head: null,
    neck: null,
    spine: null,
    baseHeadRot: new THREE.Euler(),
    baseNeckRot: new THREE.Euler(),
    baseSpineRot: new THREE.Euler(),
  })

  // Automatically compute camera position and framing for FULL MODEL
  useEffect(() => {
    if (!clonedScene) return

    let headBone = null
    let neckBone = null
    let spineBone = null

    clonedScene.traverse((node) => {
      if (node.isBone) {
        const name = node.name.toLowerCase()
        if (name.includes("head") && !name.includes("top") && !headBone) {
          headBone = node
        } else if (name.includes("neck") && !neckBone) {
          neckBone = node
        } else if (
          (name.includes("spine2") || name.includes("spine1") || name.includes("spine")) &&
          !spineBone
        ) {
          spineBone = node
        }
      }
    })

    bonesRef.current = {
      head: headBone,
      neck: neckBone,
      spine: spineBone,
      baseHeadRot: headBone ? headBone.rotation.clone() : new THREE.Euler(),
      baseNeckRot: neckBone ? neckBone.rotation.clone() : new THREE.Euler(),
      baseSpineRot: spineBone ? spineBone.rotation.clone() : new THREE.Euler(),
    }

    // Compute bounding box for full character model
    const box = new THREE.Box3().setFromObject(clonedScene)
    const modelSize = new THREE.Vector3()
    const modelCenter = new THREE.Vector3()
    box.getSize(modelSize)
    box.getCenter(modelCenter)

    // Center the entire model in 3D world space (so feet to head are centered)
    clonedScene.position.set(-modelCenter.x, -modelCenter.y, -modelCenter.z)
    setModelBounds({ size: modelSize, center: modelCenter })

    // Compute camera distance so full body fits comfortably from head to toe
    const fov = camera.fov || 28
    const padding = 1.12 // 12% breathing room so shoes and head top are never clipped
    const aspect = Math.max(canvasSize.width / Math.max(canvasSize.height, 1), 0.3)

    const distY = (modelSize.y * padding) / (2 * Math.tan((fov * Math.PI) / 360))
    const distX = (modelSize.x * padding) / (2 * Math.tan((fov * Math.PI) / 360) * aspect)

    const distance = Math.max(distY, distX, 1.2)

    camera.position.set(0, 0, distance)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [clonedScene, camera, canvasSize.width, canvasSize.height])

  // Frame update: subtle breathing + smooth mouse tracking on hover
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    const { head, neck, spine, baseHeadRot, baseNeckRot, baseSpineRot } = bonesRef.current

    // 1. Subtle idle floating / breathing motion
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.8) * 0.008
    }

    // 2. Mouse hover tracking
    let targetHeadY = 0
    let targetHeadX = 0
    let targetNeckY = 0
    let targetSpineY = 0

    const coords = pointerPosRef?.current || pointerPos

    if (isHovered && coords) {
      targetHeadY = coords.x * 0.42
      targetHeadX = -coords.y * 0.25
      targetNeckY = coords.x * 0.15
      targetSpineY = coords.x * 0.1
    }

    if (head && baseHeadRot) {
      head.rotation.y = THREE.MathUtils.damp(
        head.rotation.y,
        baseHeadRot.y + targetHeadY,
        4.5,
        delta
      )
      head.rotation.x = THREE.MathUtils.damp(
        head.rotation.x,
        baseHeadRot.x + targetHeadX,
        4.5,
        delta
      )
    } else if (groupRef.current) {
      // Fallback: subtly rotate entire model if bones are unavailable
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetHeadY * 0.3,
        4.5,
        delta
      )
    }

    if (neck && baseNeckRot) {
      neck.rotation.y = THREE.MathUtils.damp(
        neck.rotation.y,
        baseNeckRot.y + targetNeckY,
        4.5,
        delta
      )
    }

    if (spine && baseSpineRot) {
      spine.rotation.y = THREE.MathUtils.damp(
        spine.rotation.y,
        baseSpineRot.y + targetSpineY,
        4.5,
        delta
      )
    }

    // 3. Smooth lighting and pedestal ring glow transition on hover
    if (rimLightRef.current) {
      const targetRim = isHovered ? 2.5 : 1.5
      rimLightRef.current.intensity = THREE.MathUtils.damp(
        rimLightRef.current.intensity,
        targetRim,
        4,
        delta
      )
    }
    if (keyLightRef.current) {
      const targetKey = isHovered ? 1.5 : 1.1
      keyLightRef.current.intensity = THREE.MathUtils.damp(
        keyLightRef.current.intensity,
        targetKey,
        4,
        delta
      )
    }
    if (groundRingRef.current) {
      const targetOpacity = isHovered ? 0.5 : 0.22
      groundRingRef.current.opacity = THREE.MathUtils.damp(
        groundRingRef.current.opacity,
        targetOpacity,
        4,
        delta
      )
    }
  })

  const halfHeight = modelBounds.size.y / 2

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight
        ref={keyLightRef}
        position={[2.5, 4, 3.5]}
        intensity={1.1}
      />
      <directionalLight
        ref={rimLightRef}
        position={[-3, 1, -2.5]}
        intensity={1.5}
        color="#ff5219" // Signal orange rim light
      />
      <directionalLight position={[0, 4, -1]} intensity={0.4} color="#94a3b8" />

      {/* Full Body Character Model Group */}
      <group ref={groupRef}>
        {clonedScene && <primitive object={clonedScene} />}

        {/* Subtle holographic ground ring at character feet */}
        <mesh position={[0, -halfHeight + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.1, 0.28, 32]} />
          <meshBasicMaterial ref={groundRingRef} color="#ff5219" transparent opacity={0.22} />
        </mesh>
        <mesh position={[0, -halfHeight, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.26, 32]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.4} />
        </mesh>
      </group>
    </>
  )
}

export default function CharacterSceneCanvas({ isHovered, pointerPos, pointerPosRef }) {
  return (
    <Canvas
      camera={{ fov: 28, near: 0.1, far: 20 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.5]}
      className="w-full h-full pointer-events-none"
    >
      <SceneContent
        isHovered={isHovered}
        pointerPos={pointerPos}
        pointerPosRef={pointerPosRef}
      />
    </Canvas>
  )
}
