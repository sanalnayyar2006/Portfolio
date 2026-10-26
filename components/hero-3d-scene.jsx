"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

export default function Hero3DScene() {
  const containerRef = useRef(null)
  const [wireframeMode, setWireframeMode] = useState("dual") // "dual" | "wireframe" | "solid"
  const [geometryType, setGeometryType] = useState("polyhedron") // "polyhedron" | "knot" | "cube"
  const [isRotating, setIsRotating] = useState(true)
  const [stats, setStats] = useState({ vertices: 0, faces: 0, fps: 60 })
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  // Mutable refs for Three.js state
  const stateRef = useRef({
    wireframeMode: "dual",
    geometryType: "polyhedron",
    isRotating: true,
    meshGroup: null,
    solidMesh: null,
    wireframeMesh: null,
    pointCloud: null,
    targetRotation: { x: 0, y: 0 },
    currentRotation: { x: 0, y: 0 },
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    dragVelocity: { x: 0, y: 0 },
  })

  // Synchronize component state with mutable refs
  useEffect(() => {
    stateRef.current.wireframeMode = wireframeMode
    stateRef.current.geometryType = geometryType
    stateRef.current.isRotating = isRotating
  }, [wireframeMode, geometryType, isRotating])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let width = container.clientWidth
    let height = container.clientHeight

    // Scene
    const scene = new THREE.Scene()
    // Subtle architectural fog to blend with the matte dark background
    scene.fog = new THREE.FogExp2(0x090a0f, 0.05)

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 7.5)

    // Renderer - antialias, no shiny bloom, opaque matte output
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x090a0f, 0)
    container.appendChild(renderer.domElement)

    // Lighting (Industrial / Architectural Rim & Key light - matte reflection)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4)
    keyLight.position.set(5, 8, 5)
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0xff5219, 1.6) // Signal Orange rim
    rimLight.position.set(-6, -4, -4)
    scene.add(rimLight)

    const topFill = new THREE.DirectionalLight(0x94a3b8, 0.8)
    topFill.position.set(0, 10, 0)
    scene.add(topFill)

    // 3D Background Spatial Grid Points
    const particleCount = 200
    const particleGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 18
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 14
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 3
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3))

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x2b3244,
      size: 0.06,
      transparent: true,
      opacity: 0.8,
    })
    const pointCloud = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(pointCloud)
    stateRef.current.pointCloud = pointCloud

    // Main 3D Mesh Group
    const meshGroup = new THREE.Group()
    scene.add(meshGroup)
    stateRef.current.meshGroup = meshGroup

    // Helper to build geometries
    const createGeometry = (type) => {
      let geo
      if (type === "knot") {
        geo = new THREE.TorusKnotGeometry(1.4, 0.45, 128, 32, 2, 3)
      } else if (type === "cube") {
        geo = new THREE.BoxGeometry(2.3, 2.3, 2.3, 4, 4, 4)
      } else {
        // Complex geodesic icosahedron
        geo = new THREE.IcosahedronGeometry(2.0, 1)
      }
      return geo
    }

    // Function to re-assemble the active meshes
    const updateMeshes = () => {
      // Clear existing children
      while (meshGroup.children.length > 0) {
        const obj = meshGroup.children[0]
        meshGroup.remove(obj)
        if (obj.geometry) obj.geometry.dispose()
      }

      const currentType = stateRef.current.geometryType
      const currentMode = stateRef.current.wireframeMode
      const geo = createGeometry(currentType)

      // Solid Matte Core Mesh
      const solidMat = new THREE.MeshStandardMaterial({
        color: 0x141822,
        roughness: 0.85,
        metalness: 0.15,
        flatShading: true,
      })
      const solidMesh = new THREE.Mesh(geo, solidMat)

      // Outer Wireframe Overlay
      const wireframeGeo = new THREE.WireframeGeometry(geo)
      const wireframeMat = new THREE.LineBasicMaterial({
        color: 0xff5219, // Signal Orange
        linewidth: 1.5,
        transparent: true,
        opacity: 0.75,
      })
      const wireframeMesh = new THREE.LineSegments(wireframeGeo, wireframeMat)

      // Second subtle inner edge wireframe for density
      const edgesGeo = new THREE.EdgesGeometry(geo)
      const edgesMat = new THREE.LineBasicMaterial({
        color: 0x64748b,
        transparent: true,
        opacity: 0.4,
      })
      const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat)

      if (currentMode === "dual") {
        meshGroup.add(solidMesh)
        meshGroup.add(wireframeMesh)
        meshGroup.add(edgesMesh)
      } else if (currentMode === "wireframe") {
        meshGroup.add(wireframeMesh)
        meshGroup.add(edgesMesh)
      } else if (currentMode === "solid") {
        meshGroup.add(solidMesh)
      }

      stateRef.current.solidMesh = solidMesh
      stateRef.current.wireframeMesh = wireframeMesh

      // Update statistics
      const posAttr = geo.getAttribute("position")
      const vertexCount = posAttr ? posAttr.count : 0
      const indexAttr = geo.getIndex()
      const faceCount = indexAttr ? indexAttr.count / 3 : vertexCount / 3
      setStats((prev) => ({ ...prev, vertices: vertexCount, faces: Math.round(faceCount) }))
    }

    updateMeshes()

    // Mouse Tracking & Drag Handling
    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect()
      const clientX = e.clientX - rect.left
      const clientY = e.clientY - rect.top

      // Normalized coordinates (-1 to 1)
      const nx = (clientX / width) * 2 - 1
      const ny = -(clientY / height) * 2 + 1

      setCoords({ x: Math.round(nx * 100), y: Math.round(ny * 100) })

      if (stateRef.current.isDragging) {
        const deltaX = e.clientX - stateRef.current.previousMousePosition.x
        const deltaY = e.clientY - stateRef.current.previousMousePosition.y

        meshGroup.rotation.y += deltaX * 0.008
        meshGroup.rotation.x += deltaY * 0.008

        stateRef.current.dragVelocity = {
          x: deltaY * 0.008,
          y: deltaX * 0.008,
        }
      } else {
        // Inertia tracking when hovering
        stateRef.current.targetRotation.y = nx * 0.75
        stateRef.current.targetRotation.x = -ny * 0.55
      }

      stateRef.current.previousMousePosition = { x: e.clientX, y: e.clientY }
    }

    const handlePointerDown = (e) => {
      stateRef.current.isDragging = true
      stateRef.current.previousMousePosition = { x: e.clientX, y: e.clientY }
    }

    const handlePointerUp = () => {
      stateRef.current.isDragging = false
    }

    const domElement = renderer.domElement
    domElement.addEventListener("pointermove", handlePointerMove)
    domElement.addEventListener("pointerdown", handlePointerDown)
    window.addEventListener("pointerup", handlePointerUp)

    // Resize handling
    const handleResize = () => {
      if (!container) return
      width = container.clientWidth
      height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener("resize", handleResize)

    // Animation Loop
    let animationFrameId
    let lastTime = performance.now()
    let frameCount = 0
    let lastFpsUpdate = performance.now()

    const animate = (time) => {
      animationFrameId = requestAnimationFrame(animate)

      // FPS Calculation
      frameCount++
      if (time - lastFpsUpdate >= 1000) {
        setStats((prev) => ({
          ...prev,
          fps: Math.round((frameCount * 1000) / (time - lastFpsUpdate)),
        }))
        frameCount = 0
        lastFpsUpdate = time
      }

      // Rotate with momentum or auto-orbit
      if (!stateRef.current.isDragging) {
        // Apply friction to manual drag velocity
        stateRef.current.dragVelocity.x *= 0.94
        stateRef.current.dragVelocity.y *= 0.94
        meshGroup.rotation.x += stateRef.current.dragVelocity.x
        meshGroup.rotation.y += stateRef.current.dragVelocity.y

        // Auto rotation + mouse target damping
        if (stateRef.current.isRotating) {
          meshGroup.rotation.y += 0.004
          meshGroup.rotation.x += 0.0015
        }

        meshGroup.rotation.y += (stateRef.current.targetRotation.y - meshGroup.rotation.y * 0.1) * 0.04
        meshGroup.rotation.x += (stateRef.current.targetRotation.x - meshGroup.rotation.x * 0.1) * 0.04
      }

      // Slow background point cloud float
      pointCloud.rotation.y += 0.0006
      pointCloud.rotation.x += 0.0003

      renderer.render(scene, camera)
    }

    animate(performance.now())

    // Store update function in ref for external controls
    stateRef.current.rebuildMeshes = updateMeshes

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("pointerup", handlePointerUp)
      domElement.removeEventListener("pointermove", handlePointerMove)
      domElement.removeEventListener("pointerdown", handlePointerDown)
      if (container && domElement.parentNode === container) {
        container.removeChild(domElement)
      }
      renderer.dispose()
    }
  }, [])

  // Trigger rebuild when mode or geometry changes
  useEffect(() => {
    if (stateRef.current.rebuildMeshes) {
      stateRef.current.rebuildMeshes()
    }
  }, [wireframeMode, geometryType])

  return (
    <div className="relative w-full h-[540px] lg:h-[620px] panel-matte rounded-none border border-[#222634] overflow-hidden select-none">
      {/* Technical HUD Header */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-4 py-2.5 bg-[#0e1017] border-b border-[#222634] text-xs font-mono text-[#8a94a6]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#ff5219] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#ff5219] animate-pulse" />
            3D SPATIAL ENGINE
          </span>
          <span className="hidden sm:inline text-[#3a4254]">|</span>
          <span className="hidden sm:inline">THREE.JS / WEBGL 2.0</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div>
            COORDS: <span className="text-[#f1f3f9]">X:{coords.x} Y:{coords.y}</span>
          </div>
          <div className="hidden md:block">
            VERTS: <span className="text-[#f1f3f9]">{stats.vertices}</span>
          </div>
          <div className="hidden md:block">
            FACES: <span className="text-[#f1f3f9]">{stats.faces}</span>
          </div>
          <div>
            FPS: <span className="text-[#10b981] font-bold">{stats.fps}</span>
          </div>
        </div>
      </div>

      {/* 3D Canvas Mount Point */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing blueprint-grid"
        title="Click and drag to rotate the 3D model"
      />

      {/* Interactive 3D Control Bar (Bottom HUD) */}
      <div className="absolute bottom-3 inset-x-3 z-20 flex flex-wrap items-center justify-between gap-2 p-2.5 bg-[#0e1017]/95 border border-[#222634] text-xs font-mono">
        {/* Geometry Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#7e899b] text-[10px] uppercase tracking-wider mr-1 hidden sm:inline">FORM:</span>
          {[
            { id: "polyhedron", label: "GEODESIC" },
            { id: "knot", label: "TORUS KNOT" },
            { id: "cube", label: "HYPERCUBE" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setGeometryType(item.id)}
              className={`px-2.5 py-1 text-[11px] font-semibold border transition-all ${
                geometryType === item.id
                  ? "bg-[#ff5219] text-white border-[#ff6e3d]"
                  : "bg-[#141822] text-[#94a3b8] border-[#252b3b] hover:border-[#3d465c] hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Shading Mode Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#7e899b] text-[10px] uppercase tracking-wider mr-1 hidden sm:inline">SHADING:</span>
          {[
            { id: "dual", label: "DUAL" },
            { id: "wireframe", label: "WIRE" },
            { id: "solid", label: "MATTE" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setWireframeMode(item.id)}
              className={`px-2.5 py-1 text-[11px] font-semibold border transition-all ${
                wireframeMode === item.id
                  ? "bg-[#202636] text-white border-[#ff5219]"
                  : "bg-[#141822] text-[#94a3b8] border-[#252b3b] hover:border-[#3d465c] hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Rotation Toggle */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-2.5 py-1 text-[11px] font-semibold border transition-all ${
              isRotating
                ? "bg-[#171c26] text-[#10b981] border-[#10b981]/40"
                : "bg-[#141822] text-[#7e899b] border-[#252b3b]"
            }`}
            title="Toggle Auto Rotation"
          >
            {isRotating ? "ORBIT ON" : "PAUSED"}
          </button>
        </div>
      </div>

      {/* Crosshair Corner Markers */}
      <div className="absolute top-10 left-3 text-[10px] font-mono text-[#3d465c] pointer-events-none">
        [SYS.3D // ROTATION_INERTIA: ACTIVE]
      </div>
      <div className="absolute top-10 right-3 text-[10px] font-mono text-[#3d465c] pointer-events-none">
        [DRAG TO ROTATE]
      </div>
    </div>
  )
}
