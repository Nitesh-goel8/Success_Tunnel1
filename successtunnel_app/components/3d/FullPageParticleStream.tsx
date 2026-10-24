import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface FullPageParticleStreamProps {
  className?: string
}

export default function FullPageParticleStream({ className }: FullPageParticleStreamProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [webglAvailable, setWebglAvailable] = useState(true)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // 1. Verify WebGL support
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

    let width = window.innerWidth
    let height = window.innerHeight

    // 2. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100)
    camera.position.set(0, 0, 8)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)

    // 3. Create High-Resolution Circular Glow Particle Texture
    const particleCanvas = document.createElement('canvas')
    particleCanvas.width = 64
    particleCanvas.height = 64
    const ctx = particleCanvas.getContext('2d')
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
      grad.addColorStop(0.2, 'rgba(147, 197, 253, 0.95)')
      grad.addColorStop(0.5, 'rgba(37, 99, 235, 0.45)')
      grad.addColorStop(0.85, 'rgba(2, 132, 199, 0.15)')
      grad.addColorStop(1, 'rgba(10, 37, 64, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 64, 64)
    }
    const particleTexture = new THREE.CanvasTexture(particleCanvas)

    // 4. Generate Particle System (4,200 particles) with 5 Scroll-Based Formations
    const PARTICLE_COUNT = 4200
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const targetPositions = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)
    const basePositions = new Float32Array(PARTICLE_COUNT * 3)
    const noiseOffsets = new Float32Array(PARTICLE_COUNT)

    // Formation 0: Hero Synapse Nebula & Cosmic Halo (Scroll 0.0 - 0.20)
    const getHeroNebula = (i: number) => {
      const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT)
      const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi
      const arm = i % 3
      const armAngle = (arm * Math.PI * 2) / 3
      const r = 3.6 + Math.sin(i * 0.15) * 0.8
      return [
        r * Math.cos(theta + armAngle) * Math.sin(phi),
        r * Math.sin(theta + armAngle) * Math.sin(phi) * 0.75,
        (r * Math.cos(phi) * 0.5) + (Math.sin(i * 0.2) * 0.4),
      ]
    }

    // Formation 1: 6 Interconnected Practice Orbit Clusters (Scroll 0.20 - 0.45)
    const getPracticeClusters = (i: number) => {
      const cluster = i % 6
      const clusterAngle = (cluster / 6) * Math.PI * 2
      const cx = Math.cos(clusterAngle) * 3.8
      const cy = Math.sin(clusterAngle) * 2.2
      const cz = (cluster % 2 === 0 ? 0.8 : -0.8)
      const subRadius = 0.9 + Math.random() * 0.4
      const subAngle = (i / (PARTICLE_COUNT / 6)) * Math.PI * 2
      return [
        cx + Math.cos(subAngle) * subRadius,
        cy + Math.sin(subAngle) * subRadius * 0.8,
        cz + (Math.random() - 0.5) * 0.8,
      ]
    }

    // Formation 2: Forward Trajectory Flow Stream / Dynamic Wave (Scroll 0.45 - 0.70)
    const getTrajectoryWave = (i: number) => {
      const t = (i / PARTICLE_COUNT) * 16 - 8
      const wave = Math.sin(t * 1.2) * 1.5
      const spread = (Math.random() - 0.5) * 2.4
      return [
        t * 0.85,
        wave + (Math.random() - 0.5) * 0.6,
        spread,
      ]
    }

    // Formation 3: Structured Architectural Coordinate Grid / Panipat Matrix (Scroll 0.70 - 0.88)
    const getArchitecturalGrid = (i: number) => {
      const cols = 20
      const rows = 14
      const layers = Math.floor(PARTICLE_COUNT / (cols * rows))
      const idx = i % (cols * rows)
      const c = idx % cols
      const r = Math.floor(idx / cols)
      const l = Math.floor(i / (cols * rows))
      return [
        (c / cols - 0.5) * 8.0,
        (r / rows - 0.5) * 5.0,
        (l / layers - 0.5) * 3.0,
      ]
    }

    // Formation 4: Convergence Core Vortex / Direct Action Focus (Scroll 0.88 - 1.0)
    const getConvergenceCore = (i: number) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 16
      const radius = Math.pow(i / PARTICLE_COUNT, 0.65) * 4.2
      return [
        Math.cos(angle) * radius,
        (i / PARTICLE_COUNT - 0.5) * 4.5,
        Math.sin(angle) * radius,
      ]
    }

    // Color definitions for formations
    const colorHero = new THREE.Color(0x3b82f6) // Royal Blue
    const colorPractice = new THREE.Color(0x0284c7) // Cyan Sky
    const colorWave = new THREE.Color(0x6366f1) // Indigo
    const colorGrid = new THREE.Color(0x10b981) // Emerald
    const colorCore = new THREE.Color(0x1d4ed8) // Deep Blue

    // Initialize positions
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = getHeroNebula(i)
      positions[i * 3] = p[0]
      positions[i * 3 + 1] = p[1]
      positions[i * 3 + 2] = p[2]

      targetPositions[i * 3] = p[0]
      targetPositions[i * 3 + 1] = p[1]
      targetPositions[i * 3 + 2] = p[2]

      basePositions[i * 3] = p[0]
      basePositions[i * 3 + 1] = p[1]
      basePositions[i * 3 + 2] = p[2]

      const tint = 0.75 + Math.random() * 0.5
      colors[i * 3] = colorHero.r * tint
      colors[i * 3 + 1] = colorHero.g * tint
      colors[i * 3 + 2] = colorHero.b * tint

      noiseOffsets[i] = Math.random() * Math.PI * 2
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.16,
      map: particleTexture,
      transparent: true,
      opacity: 0.78,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particleSystem = new THREE.Points(geometry, material)
    scene.add(particleSystem)

    // 5. Constellation Lines Linking Central Nodes
    const PINS = 18
    const pinPos = new Float32Array(PINS * 3)
    const lineIndices: number[] = []

    for (let p = 0; p < PINS; p++) {
      for (let q = p + 1; q < PINS; q++) {
        if ((p + q) % 4 === 0) {
          lineIndices.push(p, q)
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(pinPos, 3))
    lineGeo.setIndex(lineIndices)

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.18,
    })
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(lineMesh)

    // 6. Scroll Tracking & Smooth Interpolation
    let currentScrollProgress = 0
    let targetScrollProgress = 0

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (maxScroll > 0) {
        targetScrollProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    // 7. Global Mouse Tracking & Magnetic Ripple
    let mouseX = 0
    let mouseY = 0
    let targetMouseX = 0
    let targetMouseY = 0

    const handlePointerMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1
      targetMouseY = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    // 8. Handle Window Resize
    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    // 9. Main Animation Loop
    const clock = new THREE.Clock()
    let animationFrameId: number

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const elapsed = clock.getElapsedTime()

      // Smooth scroll progress lerp
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.05

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.04
      mouseY += (targetMouseY - mouseY) * 0.04

      // Determine active formation target based on scroll position
      let interpStage = 0
      let tStage = 0
      let activeColor = colorHero

      if (currentScrollProgress < 0.22) {
        // Stage 0: Hero Nebula
        interpStage = 0
        tStage = currentScrollProgress / 0.22
        activeColor = colorHero
      } else if (currentScrollProgress < 0.48) {
        // Stage 1: Practice Clusters
        interpStage = 1
        tStage = (currentScrollProgress - 0.22) / 0.26
        activeColor = colorPractice
      } else if (currentScrollProgress < 0.72) {
        // Stage 2: Trajectory Wave
        interpStage = 2
        tStage = (currentScrollProgress - 0.48) / 0.24
        activeColor = colorWave
      } else if (currentScrollProgress < 0.90) {
        // Stage 3: Architectural Grid
        interpStage = 3
        tStage = (currentScrollProgress - 0.72) / 0.18
        activeColor = colorGrid
      } else {
        // Stage 4: Convergence Core
        interpStage = 4
        tStage = (currentScrollProgress - 0.90) / 0.10
        activeColor = colorCore
      }

      // Update particle target positions based on stage
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        let p1: number[], p2: number[]
        if (interpStage === 0) {
          p1 = getHeroNebula(i)
          p2 = getPracticeClusters(i)
        } else if (interpStage === 1) {
          p1 = getPracticeClusters(i)
          p2 = getTrajectoryWave(i)
        } else if (interpStage === 2) {
          p1 = getTrajectoryWave(i)
          p2 = getArchitecturalGrid(i)
        } else if (interpStage === 3) {
          p1 = getArchitecturalGrid(i)
          p2 = getConvergenceCore(i)
        } else {
          p1 = getConvergenceCore(i)
          p2 = getConvergenceCore(i)
        }

        targetPositions[i * 3] = p1[0] + (p2[0] - p1[0]) * tStage
        targetPositions[i * 3 + 1] = p1[1] + (p2[1] - p1[1]) * tStage
        targetPositions[i * 3 + 2] = p1[2] + (p2[2] - p1[2]) * tStage
      }

      // Smoothly update particle vertex positions
      const posArr = geometry.attributes.position.array as Float32Array
      const colArr = geometry.attributes.color.array as Float32Array

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3
        const tx = targetPositions[i3]
        const ty = targetPositions[i3 + 1]
        const tz = targetPositions[i3 + 2]

        // Organic wave motion
        const wave = Math.sin(elapsed * 1.2 + noiseOffsets[i]) * 0.08

        posArr[i3] += (tx - posArr[i3]) * 0.06 + wave * 0.015
        posArr[i3 + 1] += (ty - posArr[i3 + 1]) * 0.06 + wave * 0.015
        posArr[i3 + 2] += (tz - posArr[i3 + 2]) * 0.06

        // Mouse displacement ripple near cursor
        const dx = posArr[i3] - mouseX * 4
        const dy = posArr[i3 + 1] - mouseY * 2.8
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 1.4) {
          const force = (1.4 - dist) * 0.03
          posArr[i3] += dx * force
          posArr[i3 + 1] += dy * force
        }

        // Color transition
        colArr[i3] += (activeColor.r - colArr[i3]) * 0.03
        colArr[i3 + 1] += (activeColor.g - colArr[i3 + 1]) * 0.03
        colArr[i3 + 2] += (activeColor.b - colArr[i3 + 2]) * 0.03
      }
      geometry.attributes.position.needsUpdate = true
      geometry.attributes.color.needsUpdate = true

      // Update constellation pins
      const pinArr = lineGeo.attributes.position.array as Float32Array
      for (let p = 0; p < PINS; p++) {
        const sampleIdx = Math.floor((p / PINS) * PARTICLE_COUNT)
        pinArr[p * 3] = posArr[sampleIdx * 3]
        pinArr[p * 3 + 1] = posArr[sampleIdx * 3 + 1]
        pinArr[p * 3 + 2] = posArr[sampleIdx * 3 + 2]
      }
      lineGeo.attributes.position.needsUpdate = true

      // Whole system gentle rotation
      particleSystem.rotation.y = elapsed * 0.08 + mouseX * 0.35
      particleSystem.rotation.x = Math.sin(elapsed * 0.05) * 0.08 + mouseY * 0.25
      lineMesh.rotation.copy(particleSystem.rotation)

      // Dynamic camera parallax with scroll
      camera.position.x = mouseX * 1.1
      camera.position.y = mouseY * 0.8 - currentScrollProgress * 1.5
      camera.lookAt(0, -currentScrollProgress * 1.5, 0)

      renderer.render(scene, camera)
    }

    animate()

    // 10. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('resize', handleResize)

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
    return null
  }

  return (
    <div
      ref={mountRef}
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    />
  )
}
