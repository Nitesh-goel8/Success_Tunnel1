import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface HeroScene3DProps {
  className?: string
}

export default function HeroScene3D({ className }: HeroScene3DProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(() => {
    // Check WebGL availability safely
    try {
      const canvas = document.createElement('canvas')
      const isSupported = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      )
      if (!isSupported) {
        setWebGlSupported(false)
        return
      }
    } catch {
      setWebGlSupported(false)
      return
    }

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const container = mountRef.current
    if (!container) return

    let width = container.clientWidth || 500
    let height = container.clientHeight || 500

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 0, 18)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.5)
    scene.add(ambientLight)

    const primaryLight = new THREE.PointLight(0x38bdf8, 3.5, 50)
    primaryLight.position.set(12, 14, 15)
    scene.add(primaryLight)

    const accentLight = new THREE.PointLight(0x2563eb, 3.0, 50)
    accentLight.position.set(-12, -10, 10)
    scene.add(accentLight)

    const goldLight = new THREE.PointLight(0xf59e0b, 1.8, 30)
    goldLight.position.set(0, -8, -5)
    scene.add(goldLight)

    // 3. Central Ecosystem Core Group
    const rootGroup = new THREE.Group()
    scene.add(rootGroup)

    // Central Multi-faceted Crystal Core
    const coreGeo = new THREE.IcosahedronGeometry(2.6, 1)
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f2756,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.35,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    rootGroup.add(coreMesh)

    // Glowing Core Wireframe Shell
    const wireGeo = new THREE.IcosahedronGeometry(2.68, 1)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    })
    const wireMesh = new THREE.Mesh(wireGeo, wireMat)
    rootGroup.add(wireMesh)

    // 4. Concentric Architectural Orbital Rings
    const ringGeo1 = new THREE.TorusGeometry(5.2, 0.04, 16, 100)
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.9,
    })
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1)
    ring1.rotation.x = Math.PI / 3
    ring1.rotation.y = Math.PI / 8
    rootGroup.add(ring1)

    const ringGeo2 = new THREE.TorusGeometry(6.6, 0.035, 16, 120)
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.6,
      roughness: 0.4,
      metalness: 0.8,
    })
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2)
    ring2.rotation.x = -Math.PI / 4
    ring2.rotation.y = Math.PI / 5
    rootGroup.add(ring2)

    const ringGeo3 = new THREE.TorusGeometry(7.8, 0.025, 16, 140)
    const ringMat3 = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x1e40af,
      emissiveIntensity: 0.4,
      roughness: 0.5,
      metalness: 0.7,
      transparent: true,
      opacity: 0.6,
    })
    const ring3 = new THREE.Mesh(ringGeo3, ringMat3)
    ring3.rotation.x = Math.PI / 6
    ring3.rotation.z = Math.PI / 3
    rootGroup.add(ring3)

    // 5. Orbital Satellites (Representing 6 Core Corporate Practices)
    // Consultancy, Finance, Education, Investment, Real Estate, Workspace
    const satelliteNodes: { mesh: THREE.Mesh; orbitRadius: number; speed: number; angle: number; yOffset: number }[] = []
    const practiceColors = [0x38bdf8, 0x60a5fa, 0xa855f7, 0xf59e0b, 0x10b981, 0xec4899]

    for (let i = 0; i < 6; i++) {
      const radius = 0.42 + (i % 2) * 0.1
      const satGeo = new THREE.OctahedronGeometry(radius, 0)
      const satMat = new THREE.MeshPhysicalMaterial({
        color: practiceColors[i],
        emissive: practiceColors[i],
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8,
        clearcoat: 0.8,
      })
      const satMesh = new THREE.Mesh(satGeo, satMat)
      rootGroup.add(satMesh)

      satelliteNodes.push({
        mesh: satMesh,
        orbitRadius: 4.8 + (i * 0.55),
        speed: (0.28 + (i * 0.04)) * (i % 2 === 0 ? 1 : -1),
        angle: (i / 6) * Math.PI * 2,
        yOffset: Math.sin(i * 1.2) * 1.8,
      })
    }

    // 6. Ambient Particle Stardust Field
    const particleCount = 220
    const particlePositions = new Float32Array(particleCount * 3)
    const particleColors = new Float32Array(particleCount * 3)

    for (let p = 0; p < particleCount; p++) {
      const pIdx = p * 3
      const radius = 6 + Math.random() * 12
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)

      particlePositions[pIdx] = radius * Math.sin(phi) * Math.cos(theta)
      particlePositions[pIdx + 1] = radius * Math.sin(phi) * Math.sin(theta)
      particlePositions[pIdx + 2] = radius * Math.cos(phi)

      // Gradient from cyan to blue to soft gold
      if (p % 3 === 0) {
        particleColors[pIdx] = 0.22; particleColors[pIdx + 1] = 0.74; particleColors[pIdx + 2] = 0.97
      } else if (p % 3 === 1) {
        particleColors[pIdx] = 0.15; particleColors[pIdx + 1] = 0.39; particleColors[pIdx + 2] = 0.92
      } else {
        particleColors[pIdx] = 0.96; particleColors[pIdx + 1] = 0.62; particleColors[pIdx + 2] = 0.04
      }
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    })
    const particleField = new THREE.Points(particleGeo, particleMat)
    scene.add(particleField)

    // 7. Interactive Pointer Parallax
    let targetRotationX = 0
    let targetRotationY = 0
    let currentRotationX = 0
    let currentRotationY = 0

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      targetRotationY = x * 0.45
      targetRotationX = -y * 0.35
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return
      const touch = e.touches[0]
      const rect = container.getBoundingClientRect()
      const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1
      const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1)
      targetRotationY = x * 0.35
      targetRotationX = -y * 0.25
    }

    window.addEventListener('mousemove', handlePointerMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    // 8. Responsive Resize Handler
    const handleResize = () => {
      if (!container) return
      width = container.clientWidth || 500
      height = container.clientHeight || 500
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    // 9. Main Animation Loop
    let animationFrameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const delta = clock.getDelta()
      const elapsedTime = clock.getElapsedTime()

      // Pointer Parallax Lerp
      currentRotationX += (targetRotationX - currentRotationX) * 0.05
      currentRotationY += (targetRotationY - currentRotationY) * 0.05

      rootGroup.rotation.x = currentRotationX
      rootGroup.rotation.y = currentRotationY

      if (!prefersReducedMotion) {
        // Continuous Ambient Rotations
        coreMesh.rotation.y += 0.005
        coreMesh.rotation.x += 0.003
        wireMesh.rotation.y -= 0.007
        wireMesh.rotation.z += 0.004

        ring1.rotation.z += 0.004
        ring2.rotation.z -= 0.003
        ring3.rotation.y += 0.005

        // Satellite Orbit Trajectories
        satelliteNodes.forEach((node, idx) => {
          const currentAngle = node.angle + elapsedTime * node.speed * 0.4
          node.mesh.position.x = Math.cos(currentAngle) * node.orbitRadius
          node.mesh.position.z = Math.sin(currentAngle) * node.orbitRadius
          node.mesh.position.y = node.yOffset + Math.sin(elapsedTime * 1.5 + idx) * 0.5
          node.mesh.rotation.x += 0.02
          node.mesh.rotation.y += 0.03
        })

        // Particle field subtle drift
        particleField.rotation.y = elapsedTime * 0.02
        particleField.rotation.x = Math.sin(elapsedTime * 0.01) * 0.1
      }

      renderer.render(scene, camera)
    }

    animate()
    setIsLoaded(true)

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('resize', handleResize)

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }

      // Dispose Three.js memory allocations
      coreGeo.dispose()
      coreMat.dispose()
      wireGeo.dispose()
      wireMat.dispose()
      ringGeo1.dispose()
      ringMat1.dispose()
      ringGeo2.dispose()
      ringMat2.dispose()
      ringGeo3.dispose()
      ringMat3.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      className={`hero-scene-3d-wrapper ${className || ''}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '440px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Three.js Canvas Container */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
        aria-hidden="true"
      />

      {/* WebGL Graceful Fallback if WebGL is unavailable */}
      {!webGlSupported && (
        <div
          className="webgl-fallback-container"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          aria-label="Success Tunnel Connected Ecosystem Architecture"
        >
          <div
            style={{
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, rgba(15,23,42,0) 70%)',
              border: '1px solid rgba(56,189,248,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 4s ease-in-out infinite',
            }}
          >
            <div
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1e3a8a, #0f172a)',
                border: '2px solid rgba(56,189,248,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 40px rgba(56,189,248,0.3)',
              }}
            >
              <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.2rem', fontFamily: 'Sora, sans-serif' }}>
                ST CORE
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Subtle Ambient Radial Lighting Behind 3D Composition */}
      <div
        style={{
          position: 'absolute',
          inset: '10%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(56,189,248,0.08) 40%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
    </div>
  )
}
