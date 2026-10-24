import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface ArchitecturalLightTunnelProps {
  className?: string
}

export default function ArchitecturalLightTunnel({ className }: ArchitecturalLightTunnelProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [webglSupported, setWebglSupported] = useState(true)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // 1. Check WebGL support
    try {
      const testCanvas = document.createElement('canvas')
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')
      if (!gl) {
        setWebglSupported(false)
        return
      }
    } catch {
      setWebglSupported(false)
      return
    }

    // 2. Setup Scene, Camera, Renderer
    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || 650

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x080d18, 0.04)

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 80)
    camera.position.set(0, 0, 4.5)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.setClearColor(0x080d18, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x101c36, 1.2)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0x4d8dff, 2.4)
    keyLight.position.set(5, 8, 4)
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0x68d9e8, 1.6)
    rimLight.position.set(-6, -4, -6)
    scene.add(rimLight)

    const horizonGlow = new THREE.PointLight(0x4d8dff, 3.5, 30, 1.5)
    horizonGlow.position.set(0, 0, -28)
    scene.add(horizonGlow)

    // 4. Geometry Materials
    const darkFrameMaterial = new THREE.MeshStandardMaterial({
      color: 0x0c1424,
      metalness: 0.9,
      roughness: 0.18,
    })

    const lightEdgeMaterial = new THREE.MeshBasicMaterial({
      color: 0x4d8dff,
      transparent: true,
      opacity: 0.85
    })

    const cyanEdgeMaterial = new THREE.MeshBasicMaterial({
      color: 0x68d9e8,
      transparent: true,
      opacity: 0.7
    })

    // 5. Build Layered Architectural Portals
    const tunnelGroup = new THREE.Group()
    scene.add(tunnelGroup)

    const portalCount = 14
    const tunnelDepth = 35
    const stepZ = tunnelDepth / portalCount
    const portalFrames: THREE.Group[] = []

    const outerWidth = 5.2
    const outerHeight = 3.6
    const beamThickness = 0.14
    const beamDepth = 0.35

    const hBeamGeo = new THREE.BoxGeometry(outerWidth, beamThickness, beamDepth)
    const vBeamGeo = new THREE.BoxGeometry(beamThickness, outerHeight, beamDepth)
    const lineGeo = new THREE.BoxGeometry(outerWidth * 0.98, 0.02, 0.04)
    const vLineGeo = new THREE.BoxGeometry(0.02, outerHeight * 0.98, 0.04)

    for (let i = 0; i < portalCount; i++) {
      const frame = new THREE.Group()
      const zPos = -i * stepZ

      // Top Beam
      const topBeam = new THREE.Mesh(hBeamGeo, darkFrameMaterial)
      topBeam.position.set(0, outerHeight / 2, 0)
      frame.add(topBeam)

      // Bottom Beam
      const bottomBeam = new THREE.Mesh(hBeamGeo, darkFrameMaterial)
      bottomBeam.position.set(0, -outerHeight / 2, 0)
      frame.add(bottomBeam)

      // Left Beam
      const leftBeam = new THREE.Mesh(vBeamGeo, darkFrameMaterial)
      leftBeam.position.set(-outerWidth / 2, 0, 0)
      frame.add(leftBeam)

      // Right Beam
      const rightBeam = new THREE.Mesh(vBeamGeo, darkFrameMaterial)
      rightBeam.position.set(outerWidth / 2, 0, 0)
      frame.add(rightBeam)

      // Luminous inner accent light strip
      const useCyan = i % 3 === 0
      const activeMat = useCyan ? cyanEdgeMaterial : lightEdgeMaterial

      const topLight = new THREE.Mesh(lineGeo, activeMat)
      topLight.position.set(0, outerHeight / 2 - beamThickness / 2, 0.05)
      frame.add(topLight)

      const bottomLight = new THREE.Mesh(lineGeo, activeMat)
      bottomLight.position.set(0, -outerHeight / 2 + beamThickness / 2, 0.05)
      frame.add(bottomLight)

      const leftLight = new THREE.Mesh(vLineGeo, activeMat)
      leftLight.position.set(-outerWidth / 2 + beamThickness / 2, 0, 0.05)
      frame.add(leftLight)

      const rightLight = new THREE.Mesh(vLineGeo, activeMat)
      rightLight.position.set(outerWidth / 2 - beamThickness / 2, 0, 0.05)
      frame.add(rightLight)

      frame.position.z = zPos
      tunnelGroup.add(frame)
      portalFrames.push(frame)
    }

    // 6. Vanishing Horizon Beacon (Clarity Aperture at Tunnel's End)
    const beaconGroup = new THREE.Group()
    beaconGroup.position.set(0, 0, -30)

    const ringGeo = new THREE.TorusGeometry(1.4, 0.04, 16, 64)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x4d8dff, transparent: true, opacity: 0.9 })
    const beaconRing1 = new THREE.Mesh(ringGeo, ringMat)
    beaconGroup.add(beaconRing1)

    const ringGeo2 = new THREE.TorusGeometry(1.8, 0.02, 16, 64)
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x68d9e8, transparent: true, opacity: 0.6 })
    const beaconRing2 = new THREE.Mesh(ringGeo2, ringMat2)
    beaconGroup.add(beaconRing2)

    scene.add(beaconGroup)

    // 7. Architectural Guide Rails (Connecting diagonal vectors)
    const railMat = new THREE.LineBasicMaterial({ color: 0x1d3557, transparent: true, opacity: 0.4 })
    const corners = [
      [-outerWidth / 2, outerHeight / 2],
      [outerWidth / 2, outerHeight / 2],
      [-outerWidth / 2, -outerHeight / 2],
      [outerWidth / 2, -outerHeight / 2],
    ]

    corners.forEach(([x, y]) => {
      const points = [
        new THREE.Vector3(x, y, 6),
        new THREE.Vector3(x * 0.35, y * 0.35, -34)
      ]
      const railGeo = new THREE.BufferGeometry().setFromPoints(points)
      const rail = new THREE.Line(railGeo, railMat)
      scene.add(rail)
    })

    // 8. Interactive Parallax & Animation State
    let mouseX = 0
    let mouseY = 0
    let targetMouseX = 0
    let targetMouseY = 0
    let scrollProgress = 0
    let animationFrameId: number
    let isVisible = true

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      targetMouseX = x * 0.6
      targetMouseY = y * 0.35
    }

    const handleScroll = () => {
      const scrollY = window.scrollY
      scrollProgress = Math.min(scrollY / 800, 1.5)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    // IntersectionObserver to pause when off-screen
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting
        })
      },
      { threshold: 0.05 }
    )
    observer.observe(container)

    // Handle Resize
    const handleResize = () => {
      if (!container) return
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }
    window.addEventListener('resize', handleResize)

    // 9. Animation Loop
    const clock = new THREE.Clock()
    const forwardSpeed = 1.8

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      if (!isVisible) return

      const delta = clock.getDelta()
      const speedMultiplier = 1 + scrollProgress * 1.5
      const frameDelta = delta * forwardSpeed * speedMultiplier

      // Move portal frames forward infinitely
      for (let i = 0; i < portalFrames.length; i++) {
        const frame = portalFrames[i]
        frame.position.z += frameDelta

        // When a frame passes behind camera, loop it back to the far end
        if (frame.position.z > 5) {
          frame.position.z -= tunnelDepth
        }

        // Subtly scale and orient frames with depth
        const depthFactor = (frame.position.z + tunnelDepth) / tunnelDepth
        frame.rotation.z = Math.sin(frame.position.z * 0.1) * 0.015
      }

      // Smooth camera interpolation
      mouseX += (targetMouseX - mouseX) * 0.04
      mouseY += (targetMouseY - mouseY) * 0.04

      camera.position.x = mouseX * 1.2
      camera.position.y = mouseY * 0.8
      camera.lookAt(mouseX * 0.4, mouseY * 0.3, -25)

      // Slow pulse on beacon ring
      beaconRing1.rotation.z += 0.005
      beaconRing2.rotation.z -= 0.003
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 1.8) * 0.06
      beaconGroup.scale.set(pulse, pulse, 1)

      renderer.render(scene, camera)
    }

    animate()

    // 10. Resource Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      observer.disconnect()

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }

      hBeamGeo.dispose()
      vBeamGeo.dispose()
      lineGeo.dispose()
      vLineGeo.dispose()
      ringGeo.dispose()
      ringGeo2.dispose()
      darkFrameMaterial.dispose()
      lightEdgeMaterial.dispose()
      cyanEdgeMaterial.dispose()
      ringMat.dispose()
      ringMat2.dispose()
      railMat.dispose()
      renderer.dispose()
    }
  }, [])

  if (!webglSupported) {
    return (
      <div
        className={className}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '560px',
          background: 'radial-gradient(ellipse at 50% 50%, #101c36 0%, #080d18 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', color: '#B9C0CA', fontSize: '0.9rem', maxWidth: '360px', padding: '24px' }}>
          <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', border: '1px solid #4D8DFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4D8DFF', fontWeight: 800 }}>
            ST
          </div>
          Success Tunnel Architectural Advisory Core
        </div>
      </div>
    )
  }

  return (
    <div
      ref={mountRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    />
  )
}
