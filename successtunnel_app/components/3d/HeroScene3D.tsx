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
    // 1. WebGL Support Verification
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

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const container = mountRef.current
    if (!container) return

    let width = container.clientWidth || 480
    let height = container.clientHeight || 480

    // 2. Scene, Camera, High-Precision Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000)
    camera.position.set(0, 0, 16)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    renderer.shadowMap.enabled = false
    container.appendChild(renderer.domElement)

    // 3. Balanced Architectural Lighting
    // Subtle dark ambient fill
    const ambientLight = new THREE.AmbientLight(0x0a101d, 3.0)
    scene.add(ambientLight)

    // Directional Key Light (Neutral cool daylight)
    const keyLight = new THREE.DirectionalLight(0xe2e8f0, 2.8)
    keyLight.position.set(10, 14, 12)
    scene.add(keyLight)

    // Soft Rim Light (Subtle sapphire fill)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.0)
    rimLight.position.set(-12, -8, -6)
    scene.add(rimLight)

    // Warm specular accent
    const warmLight = new THREE.PointLight(0xfef08a, 1.2, 35)
    warmLight.position.set(4, -8, 8)
    scene.add(warmLight)

    // 4. Central Architectural Monolith Composition
    const rootGroup = new THREE.Group()
    scene.add(rootGroup)

    // Monolith Core: Precision Octahedron Prism with Subdivided Faces
    const coreGeo = new THREE.OctahedronGeometry(3.2, 2)
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f1c3f,
      emissive: 0x0c1527,
      emissiveIntensity: 0.15,
      roughness: 0.28,
      metalness: 0.85,
      clearcoat: 0.9,
      clearcoatRoughness: 0.18,
      reflectivity: 0.9,
      wireframe: false,
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    rootGroup.add(coreMesh)

    // Subtle Structural Edge Lattice (Cad/Architectural Blueprint Aesthetic)
    const wireGeo = new THREE.OctahedronGeometry(3.22, 2)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    })
    const wireMesh = new THREE.Mesh(wireGeo, wireMat)
    rootGroup.add(wireMesh)

    // Secondary Intersecting Geometric Ring (Refined, Fine Hairline Torus)
    const ringGeo = new THREE.TorusGeometry(5.2, 0.025, 16, 128)
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.9,
      roughness: 0.3,
      transparent: true,
      opacity: 0.55,
    })
    const ringMesh = new THREE.Mesh(ringGeo, ringMat)
    ringMesh.rotation.x = Math.PI / 3.2
    ringMesh.rotation.y = Math.PI / 6
    rootGroup.add(ringMesh)

    // Secondary Inner Orbit Ring
    const innerRingGeo = new THREE.TorusGeometry(4.4, 0.02, 16, 100)
    const innerRingMesh = new THREE.Mesh(innerRingGeo, ringMat)
    innerRingMesh.rotation.x = -Math.PI / 4
    innerRingMesh.rotation.z = Math.PI / 5
    rootGroup.add(innerRingMesh)

    // 5. Heavy-Damped Pointer Parallax
    let targetRotationX = 0
    let targetRotationY = 0
    let currentRotationX = 0
    let currentRotationY = 0

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      // Damped angle: max 0.2 rad (~11 deg)
      targetRotationY = x * 0.22
      targetRotationX = -y * 0.18
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return
      const touch = e.touches[0]
      const rect = container.getBoundingClientRect()
      const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1
      const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1)
      targetRotationY = x * 0.15
      targetRotationX = -y * 0.12
    }

    window.addEventListener('mousemove', handlePointerMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    // 6. Responsive Resize Handling
    const handleResize = () => {
      if (!container) return
      width = container.clientWidth || 480
      height = container.clientHeight || 480
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    // 7. Controlled Monolithic Animation Loop
    let animationFrameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      // Lerp pointer rotation for heavy, dignified presence
      currentRotationX += (targetRotationX - currentRotationX) * 0.035
      currentRotationY += (targetRotationY - currentRotationY) * 0.035

      rootGroup.rotation.x = currentRotationX
      rootGroup.rotation.y = currentRotationY

      if (!prefersReducedMotion) {
        // Slow, quiet monolithic axial rotation
        const delta = clock.getDelta()
        coreMesh.rotation.y += delta * 0.08
        coreMesh.rotation.z += delta * 0.04
        wireMesh.rotation.y += delta * 0.08
        wireMesh.rotation.z += delta * 0.04

        ringMesh.rotation.z += delta * 0.03
        innerRingMesh.rotation.z -= delta * 0.025
      }

      renderer.render(scene, camera)
    }

    animate()
    setIsLoaded(true)

    // 8. Complete Resource Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('resize', handleResize)

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }

      coreGeo.dispose()
      coreMat.dispose()
      wireGeo.dispose()
      wireMat.dispose()
      ringGeo.dispose()
      innerRingGeo.dispose()
      ringMat.dispose()
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
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        aria-hidden="true"
      />

      {/* Elegant Quiet Fallback when WebGL is unavailable */}
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
          aria-label="Success Tunnel Architectural Ecosystem"
        >
          <div
            style={{
              width: '240px',
              height: '240px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.2) 0%, rgba(15, 23, 42, 0.6) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8',
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  fontFamily: "'Sora', sans-serif",
                  marginBottom: '12px',
                }}
              >
                ST
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Panipat Headquarters
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtle Restrained Ambient Radial Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: '12%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(30, 58, 138, 0.14) 0%, rgba(15, 23, 42, 0) 70%)',
          filter: 'blur(48px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
    </div>
  )
}
