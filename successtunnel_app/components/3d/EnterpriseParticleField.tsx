import React, { useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'

interface EnterpriseParticleFieldProps {
  activeServiceIndex?: number
  onSelectService?: (index: number) => void
  className?: string
}

// 6 Corporate Disciplines
export const practiceDisciplines = [
  { label: 'Consultancy', description: 'Statutory compliance & structural governance' },
  { label: 'Finance', description: 'Capital growth syndication & credit' },
  { label: 'Education', description: 'Structured executive tax & accounting' },
  { label: 'Investment', description: 'Treasury stability & portfolio preservation' },
  { label: 'Real Estate', description: 'Prime commercial assets & high-street leasing' },
  { label: 'Workspaces', description: 'Managed corporate suites & boardrooms' },
]

export default function EnterpriseParticleField({
  activeServiceIndex = 0,
  onSelectService,
  className,
}: EnterpriseParticleFieldProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [webglAvailable, setWebglAvailable] = useState(true)
  const activeIndexRef = useRef(activeServiceIndex)

  useEffect(() => {
    activeIndexRef.current = activeServiceIndex
  }, [activeServiceIndex])

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // 1. WebGL Support Verification
    try {
      const testCanvas = document.createElement('canvas')
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')
      if (!gl) {
        setWebglAvailable(false)
        return
      }
    } catch {
      setWebglAvailable(false)
      return
    }

    const width = container.clientWidth || 540
    const height = container.clientHeight || 500

    // 2. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    camera.position.set(0, 0, 7.5)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)

    // 3. Create High-Quality Circular Glow Particle Texture
    const particleCanvas = document.createElement('canvas')
    particleCanvas.width = 64
    particleCanvas.height = 64
    const ctx = particleCanvas.getContext('2d')
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
      grad.addColorStop(0.25, 'rgba(147, 197, 253, 0.9)')
      grad.addColorStop(0.55, 'rgba(37, 99, 235, 0.4)')
      grad.addColorStop(1, 'rgba(10, 37, 64, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 64, 64)
    }
    const particleTexture = new THREE.CanvasTexture(particleCanvas)

    // 4. Generate Particle System with 6 Morph Targets
    const PARTICLE_COUNT = 3200
    const currentPositions = new Float32Array(PARTICLE_COUNT * 3)
    const targetPositions = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)
    const baseVelocities = new Float32Array(PARTICLE_COUNT * 3)

    // Helper functions to generate 6 mathematical morph formations:
    // Formation 0: Synapse Globe / Spherical Matrix (Consultancy)
    const getSpherePosition = (i: number) => {
      const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT)
      const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi
      const r = 2.4 + (Math.sin(i * 0.3) * 0.15)
      return [
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi),
      ]
    }

    // Formation 1: Double Helix Growth Wave (Finance)
    const getHelixPosition = (i: number) => {
      const strand = i % 2 === 0 ? 1 : -1
      const t = (i / PARTICLE_COUNT) * 14 - 7
      const angle = t * 1.8 + (strand === 1 ? 0 : Math.PI)
      const r = 1.6 + Math.cos(t * 0.6) * 0.4
      return [
        r * Math.cos(angle) + (Math.random() - 0.5) * 0.2,
        t * 0.4,
        r * Math.sin(angle) + (Math.random() - 0.5) * 0.2,
      ]
    }

    // Formation 2: Concentric Expansion Rings (Education)
    const getRingsPosition = (i: number) => {
      const ring = i % 4
      const r = (ring + 1) * 0.72 + (Math.random() - 0.5) * 0.15
      const angle = (i / (PARTICLE_COUNT / 4)) * Math.PI * 2
      const tilt = ring * 0.3
      const x = r * Math.cos(angle)
      const z = r * Math.sin(angle)
      return [
        x * Math.cos(tilt) - z * Math.sin(tilt),
        (Math.sin(angle * 3) * 0.25) + (Math.random() - 0.5) * 0.1,
        x * Math.sin(tilt) + z * Math.cos(tilt),
      ]
    }

    // Formation 3: Torus Knot / Harmonic Preservation Loop (Investment)
    const getTorusPosition = (i: number) => {
      const u = (i / PARTICLE_COUNT) * Math.PI * 2 * 3
      const p = 2, q = 3
      const r = 1.7 + 0.4 * Math.cos(q * u)
      return [
        (r * Math.cos(p * u)) * 0.9,
        (r * Math.sin(p * u)) * 0.9,
        (-0.5 * Math.sin(q * u)) * 1.5,
      ]
    }

    // Formation 4: Geometric City Grid / Architectural Matrix (Real Estate)
    const getGridPosition = (i: number) => {
      const side = Math.cbrt(PARTICLE_COUNT)
      const ix = i % Math.round(side)
      const iy = Math.floor(i / side) % Math.round(side)
      const iz = Math.floor(i / (side * side))
      return [
        (ix / side - 0.5) * 4.2 + (Math.sin(i) * 0.1),
        (iy / side - 0.5) * 4.2 + (Math.cos(i) * 0.1),
        (iz / side - 0.5) * 2.8,
      ]
    }

    // Formation 5: Cosmic Synapse Vortex (Workspaces)
    const getVortexPosition = (i: number) => {
      const turns = 5
      const t = i / PARTICLE_COUNT
      const angle = t * Math.PI * 2 * turns
      const r = t * 2.8 + 0.3
      const z = (t - 0.5) * 3.2
      return [
        r * Math.cos(angle),
        z,
        r * Math.sin(angle),
      ]
    }

    // Shape generator dictionary
    const formations = [
      getSpherePosition,
      getHelixPosition,
      getRingsPosition,
      getTorusPosition,
      getGridPosition,
      getVortexPosition,
    ]

    // Color palettes for each discipline
    const palette = [
      new THREE.Color(0x3b82f6), // Royal Blue
      new THREE.Color(0x0284c7), // Cyan Sky
      new THREE.Color(0x6366f1), // Indigo
      new THREE.Color(0x10b981), // Emerald
      new THREE.Color(0xf59e0b), // Amber
      new THREE.Color(0x8b5cf6), // Violet
    ]

    // Initial shape assignment
    const initialIndex = Math.min(Math.max(activeServiceIndex, 0), 5)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const pos = formations[initialIndex](i)
      currentPositions[i * 3] = pos[0] + (Math.random() - 0.5) * 0.2
      currentPositions[i * 3 + 1] = pos[1] + (Math.random() - 0.5) * 0.2
      currentPositions[i * 3 + 2] = pos[2] + (Math.random() - 0.5) * 0.2

      targetPositions[i * 3] = pos[0]
      targetPositions[i * 3 + 1] = pos[1]
      targetPositions[i * 3 + 2] = pos[2]

      const baseCol = palette[initialIndex]
      const shade = 0.7 + Math.random() * 0.6
      colors[i * 3] = baseCol.r * shade
      colors[i * 3 + 1] = baseCol.g * shade
      colors[i * 3 + 2] = baseCol.b * shade

      sizes[i] = 0.08 + Math.random() * 0.12
      baseVelocities[i * 3] = (Math.random() - 0.5) * 0.02
      baseVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02
      baseVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.12,
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particleSystem = new THREE.Points(geometry, material)
    scene.add(particleSystem)

    // 5. Constellation Lines connecting key nodes
    const NODE_PINS = 12
    const pinPositions = new Float32Array(NODE_PINS * 3)
    const lineIndices: number[] = []

    for (let i = 0; i < NODE_PINS; i++) {
      const sampleIdx = Math.floor((i / NODE_PINS) * PARTICLE_COUNT)
      pinPositions[i * 3] = currentPositions[sampleIdx * 3]
      pinPositions[i * 3 + 1] = currentPositions[sampleIdx * 3 + 1]
      pinPositions[i * 3 + 2] = currentPositions[sampleIdx * 3 + 2]
    }

    for (let i = 0; i < NODE_PINS; i++) {
      for (let j = i + 1; j < NODE_PINS; j++) {
        if ((i + j) % 3 === 0) {
          lineIndices.push(i, j)
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(pinPositions, 3))
    lineGeo.setIndex(lineIndices)

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.22,
    })
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(lineMesh)

    // 6. Interactive Cursor Magnetic Reaction
    let mouseX = 0
    let mouseY = 0
    let targetMouseX = 0
    let targetMouseY = 0
    let isVisible = true
    let animationFrameId: number

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      targetMouseX = x
      targetMouseY = y
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting
        })
      },
      { threshold: 0.05 }
    )
    observer.observe(container)

    const handleResize = () => {
      if (!container) return
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }
    window.addEventListener('resize', handleResize)

    // 7. Morph Trigger Function when activeIndex updates
    let lastObservedIndex = initialIndex
    const updateTargetFormation = (newIdx: number) => {
      const formationFn = formations[newIdx % formations.length]
      const targetColor = palette[newIdx % palette.length]

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const pos = formationFn(i)
        targetPositions[i * 3] = pos[0]
        targetPositions[i * 3 + 1] = pos[1]
        targetPositions[i * 3 + 2] = pos[2]
      }

      lineMat.color.set(targetColor)
      lastObservedIndex = newIdx
    }

    // 8. Animation & Particle Flow Loop
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      if (!isVisible) return

      const delta = clock.getDelta()
      const elapsed = clock.getElapsedTime()

      // Check if active index changed
      if (activeIndexRef.current !== lastObservedIndex) {
        updateTargetFormation(activeIndexRef.current)
      }

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.06
      mouseY += (targetMouseY - mouseY) * 0.06

      // Rotate particle system subtly
      particleSystem.rotation.y = elapsed * 0.18 + mouseX * 0.4
      particleSystem.rotation.x = Math.sin(elapsed * 0.12) * 0.15 + mouseY * 0.3
      lineMesh.rotation.copy(particleSystem.rotation)

      // Lerp particles smoothly toward target shape with organic wave perturbation
      const positions = geometry.attributes.position.array as Float32Array
      const colorArr = geometry.attributes.color.array as Float32Array
      const targetCol = palette[lastObservedIndex % palette.length]

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3
        const targetX = targetPositions[i3]
        const targetY = targetPositions[i3 + 1]
        const targetZ = targetPositions[i3 + 2]

        // Organic floating wave modulation
        const wave = Math.sin(elapsed * 1.5 + i * 0.08) * 0.04

        positions[i3] += (targetX - positions[i3]) * 0.05 + wave * 0.01
        positions[i3 + 1] += (targetY - positions[i3 + 1]) * 0.05 + wave * 0.015
        positions[i3 + 2] += (targetZ - positions[i3 + 2]) * 0.05

        // Smooth color transition
        colorArr[i3] += (targetCol.r - colorArr[i3]) * 0.04
        colorArr[i3 + 1] += (targetCol.g - colorArr[i3 + 1]) * 0.04
        colorArr[i3 + 2] += (targetCol.b - colorArr[i3 + 2]) * 0.04
      }
      geometry.attributes.position.needsUpdate = true
      geometry.attributes.color.needsUpdate = true

      // Update constellation pins
      const pinArr = lineGeo.attributes.position.array as Float32Array
      for (let p = 0; p < NODE_PINS; p++) {
        const sampleIdx = Math.floor((p / NODE_PINS) * PARTICLE_COUNT)
        pinArr[p * 3] = positions[sampleIdx * 3]
        pinArr[p * 3 + 1] = positions[sampleIdx * 3 + 1]
        pinArr[p * 3 + 2] = positions[sampleIdx * 3 + 2]
      }
      lineGeo.attributes.position.needsUpdate = true

      camera.position.x = mouseX * 0.6
      camera.position.y = mouseY * 0.4
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    animate()

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('resize', handleResize)
      observer.disconnect()

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }

      geometry.dispose()
      material.dispose()
      lineGeo.dispose()
      lineMat.dispose()
      particleTexture.dispose()
      renderer.dispose()
    }
  }, [])

  if (!webglAvailable) {
    return (
      <div
        className={className}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '440px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--line)',
          padding: '24px',
          color: 'var(--text)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--accent)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            marginBottom: '14px',
          }}
        >
          ST
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', margin: '0 0 6px 0' }}>
          Dynamic Enterprise Constellation
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', maxWidth: '320px', margin: 0 }}>
          Coordinated multidisciplinary advisory across 6 enterprise disciplines.
        </p>
      </div>
    )
  }

  return (
    <div
      ref={mountRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '420px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
      }}
    />
  )
}
