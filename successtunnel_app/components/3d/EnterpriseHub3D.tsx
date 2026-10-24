import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface EnterpriseHub3DProps {
  activeServiceIndex?: number
  onSelectService?: (index: number) => void
  className?: string
}

const practiceLabels = [
  'Consultancy',
  'Finance',
  'Education',
  'Investment',
  'Real Estate',
  'Workspaces'
]

export default function EnterpriseHub3D({
  activeServiceIndex = 0,
  onSelectService,
  className
}: EnterpriseHub3DProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [webglAvailable, setWebglAvailable] = useState(true)

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
    const height = container.clientHeight || 520

    // 2. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100)
    camera.position.set(0, 1.2, 7.8)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.appendChild(renderer.domElement)

    // 3. Studio Lighting (Professional, Clean)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
    scene.add(ambientLight)

    const dirLight1 = new THREE.DirectionalLight(0x3b82f6, 2.2)
    dirLight1.position.set(6, 8, 7)
    scene.add(dirLight1)

    const dirLight2 = new THREE.DirectionalLight(0x60a5fa, 1.4)
    dirLight2.position.set(-6, -4, -5)
    scene.add(dirLight2)

    // 4. Central Architectural Hub Core
    const hubGroup = new THREE.Group()
    scene.add(hubGroup)

    // Central geometric faceted crystal core
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 0)
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e3a8a,
      emissive: 0x0f2b5c,
      emissiveIntensity: 0.25,
      metalness: 0.3,
      roughness: 0.15,
      transmission: 0.6,
      thickness: 1.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    hubGroup.add(coreMesh)

    // Wireframe cage surrounding the core
    const wireGeo = new THREE.IcosahedronGeometry(1.35, 1)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    })
    const wireMesh = new THREE.Mesh(wireGeo, wireMat)
    hubGroup.add(wireMesh)

    // Inner glowing core
    const innerCoreGeo = new THREE.SphereGeometry(0.55, 24, 24)
    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.7
    })
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat)
    hubGroup.add(innerCore)

    // 5. 6 Orbiting Practice Nodes (Consultancy, Finance, Education, Investment, Real Estate, Workspace)
    const nodeCount = 6
    const radius = 2.85
    const nodeMeshes: THREE.Mesh[] = []
    const lineGeometries: THREE.BufferGeometry[] = []

    const nodeGeo = new THREE.SphereGeometry(0.32, 24, 24)
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      metalness: 0.7,
      roughness: 0.2,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.4
    })

    const activeNodeMat = new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      metalness: 0.8,
      roughness: 0.15,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.9
    })

    const orbitGroup = new THREE.Group()
    hubGroup.add(orbitGroup)

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = Math.sin(angle * 2) * 0.45

      const node = new THREE.Mesh(nodeGeo, i === activeServiceIndex ? activeNodeMat : nodeMat)
      node.position.set(x, y, z)
      orbitGroup.add(node)
      nodeMeshes.push(node)

      // Outer halo ring for each node
      const haloGeo = new THREE.TorusGeometry(0.44, 0.02, 16, 32)
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.5
      })
      const halo = new THREE.Mesh(haloGeo, haloMat)
      halo.rotation.x = Math.PI / 2
      node.add(halo)

      // Connection beam from core to practice node
      const linePts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)]
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts)
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.35
      })
      const line = new THREE.Line(lineGeo, lineMat)
      orbitGroup.add(line)
      lineGeometries.push(lineGeo)
    }

    // 6. Orbital Guide Ring
    const orbitRingGeo = new THREE.TorusGeometry(radius, 0.02, 16, 64)
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.25
    })
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat)
    orbitRing.rotation.x = Math.PI / 2
    orbitGroup.add(orbitRing)

    // 7. Interactive Parallax & Animation
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0
    let isVisible = true
    let animationFrameId: number

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      targetX = x * 0.8
      targetY = y * 0.5
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

    // 8. Render Loop
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      if (!isVisible) return

      const elapsedTime = clock.getElapsedTime()

      // Smooth central rotation
      coreMesh.rotation.y = elapsedTime * 0.35
      coreMesh.rotation.x = Math.sin(elapsedTime * 0.2) * 0.25
      wireMesh.rotation.y = -elapsedTime * 0.25
      wireMesh.rotation.z = Math.cos(elapsedTime * 0.2) * 0.2

      // Smooth orbital rotation
      orbitGroup.rotation.y = elapsedTime * 0.22

      // Smooth mouse interpolation
      mouseX += (targetX - mouseX) * 0.05
      mouseY += (targetY - mouseY) * 0.05

      camera.position.x = mouseX * 2.2
      camera.position.y = 1.2 + mouseY * 1.4
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

      coreGeo.dispose()
      coreMat.dispose()
      wireGeo.dispose()
      wireMat.dispose()
      innerCoreGeo.dispose()
      innerCoreMat.dispose()
      nodeGeo.dispose()
      nodeMat.dispose()
      activeNodeMat.dispose()
      orbitRingGeo.dispose()
      orbitRingMat.dispose()
      lineGeometries.forEach(geo => geo.dispose())
      renderer.dispose()
    }
  }, [activeServiceIndex])

  if (!webglAvailable) {
    return (
      <div
        className={className}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '480px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #334155',
          padding: '24px',
          color: '#ffffff',
          textAlign: 'center'
        }}
      >
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', marginBottom: '16px' }}>
          ST
        </div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 8px 0', color: '#ffffff' }}>Success Tunnel Enterprise Core</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '320px', margin: 0 }}>
          Coordinated multidisciplinary advisory practice covering 6 enterprise disciplines.
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
        minHeight: '480px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab'
      }}
    />
  )
}
