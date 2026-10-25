import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface ArchitecturalCampus3DProps {
  activeTowerIndex?: number
  onSelectTower?: (index: number) => void
  className?: string
}

export const campusTowers = [
  { name: 'Corporate Advisory', code: 'ADV-01', height: 3.8, x: -1.8, z: -1.2, color: 0x2563eb },
  { name: 'Capital & Finance', code: 'FIN-02', height: 4.8, x: 0.2, z: -1.6, color: 0x0284c7 },
  { name: 'Commercial Real Estate', code: 'CRE-03', height: 4.2, x: 1.8, z: -0.8, color: 0x3b82f6 },
  { name: 'Managed Workspaces', code: 'WKS-04', height: 3.2, x: -1.4, z: 1.2, color: 0x6366f1 },
  { name: 'Treasury & Investment', code: 'INV-05', height: 3.6, x: 0.4, z: 1.4, color: 0x0ea5e9 },
  { name: 'Executive Education', code: 'EDU-06', height: 2.8, x: 1.9, z: 1.1, color: 0x4f46e5 },
]

export default function ArchitecturalCampus3D({
  activeTowerIndex = 0,
  onSelectTower,
  className,
}: ArchitecturalCampus3DProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [webglSupported, setWebglSupported] = useState(true)
  const [hoveredTower, setHoveredTower] = useState<number | null>(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // 1. WebGL Support Check
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

    const width = container.clientWidth || 800
    const height = container.clientHeight || 520

    // 2. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    scene.background = null

    // Isometric perspective camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.set(9, 8, 10)
    camera.lookAt(0, 1.2, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // 3. Studio Lighting (Pristine Architectural Swiss Studio)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2)
    sunLight.position.set(12, 18, 10)
    sunLight.castShadow = true
    sunLight.shadow.mapSize.width = 1024
    sunLight.shadow.mapSize.height = 1024
    sunLight.shadow.camera.near = 0.5
    sunLight.shadow.camera.far = 40
    sunLight.shadow.camera.left = -8
    sunLight.shadow.camera.right = 8
    sunLight.shadow.camera.top = 8
    sunLight.shadow.camera.bottom = -8
    sunLight.shadow.bias = -0.0005
    scene.add(sunLight)

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.0)
    fillLight.position.set(-10, 8, -10)
    scene.add(fillLight)

    const blueAccentLight = new THREE.PointLight(0x3b82f6, 2.5, 15, 1.2)
    blueAccentLight.position.set(0, 2, 0)
    scene.add(blueAccentLight)

    // 4. Campus Group
    const campusGroup = new THREE.Group()
    scene.add(campusGroup)

    // 5. Podium Base Grid & Floor Shadow Plane
    const podiumGeo = new THREE.BoxGeometry(7.5, 0.25, 6.5)
    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.05,
    })
    const podiumMesh = new THREE.Mesh(podiumGeo, podiumMat)
    podiumMesh.position.y = -0.125
    podiumMesh.receiveShadow = true
    campusGroup.add(podiumMesh)

    // Grid Floor Guide
    const gridHelper = new THREE.GridHelper(7.2, 18, 0x93c5fd, 0xe2e8f0)
    gridHelper.position.y = 0.01
    campusGroup.add(gridHelper)

    // 6. Materials for Glass & Metallic Architectural Towers
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.75,
      thickness: 1.2,
      transparent: true,
      opacity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    })

    const activeGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xeff6ff,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.35,
      metalness: 0.2,
      roughness: 0.08,
      transmission: 0.65,
      thickness: 1.4,
      transparent: true,
      opacity: 0.95,
      clearcoat: 1.0,
    })

    const titaniumCoreMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.2,
    })

    const edgeLineMat = new THREE.LineBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.6,
    })

    // 7. Build Architectural Towers
    const towerMeshes: THREE.Mesh[] = []
    const towerGroups: THREE.Group[] = []
    const towerWidth = 1.0
    const towerDepth = 1.0

    campusTowers.forEach((tower, idx) => {
      const tGroup = new THREE.Group()
      tGroup.position.set(tower.x, 0, tower.z)

      // Outer Glass Facade
      const outerGeo = new THREE.BoxGeometry(towerWidth, tower.height, towerDepth)
      const outerMesh = new THREE.Mesh(outerGeo, idx === activeTowerIndex ? activeGlassMaterial : glassMaterial)
      outerMesh.position.y = tower.height / 2
      outerMesh.castShadow = true
      outerMesh.receiveShadow = true
      outerMesh.userData = { index: idx }
      tGroup.add(outerMesh)
      towerMeshes.push(outerMesh)

      // Internal Glowing Core Column
      const coreGeo = new THREE.BoxGeometry(towerWidth * 0.45, tower.height * 0.95, towerDepth * 0.45)
      const coreMesh = new THREE.Mesh(coreGeo, titaniumCoreMat)
      coreMesh.position.y = (tower.height * 0.95) / 2
      tGroup.add(coreMesh)

      // Architectural Edge Wireframe
      const edgesGeo = new THREE.EdgesGeometry(outerGeo)
      const edgesMesh = new THREE.LineSegments(edgesGeo, edgeLineMat)
      edgesMesh.position.y = tower.height / 2
      tGroup.add(edgesMesh)

      // Spire / Beacon on top of tower
      const spireGeo = new THREE.CylinderGeometry(0.02, 0.06, 0.5, 8)
      const spireMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.9 })
      const spire = new THREE.Mesh(spireGeo, spireMat)
      spire.position.y = tower.height + 0.25
      tGroup.add(spire)

      campusGroup.add(tGroup)
      towerGroups.push(tGroup)
    })

    // 8. Connecting Skybridges between key towers
    const bridgeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.3,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85,
    })

    // Bridge 1 (T0 to T1)
    const bridge1Geo = new THREE.BoxGeometry(1.6, 0.15, 0.3)
    const bridge1 = new THREE.Mesh(bridge1Geo, bridgeMat)
    bridge1.position.set(-0.8, 2.4, -1.4)
    bridge1.rotation.y = 0.2
    campusGroup.add(bridge1)

    // Bridge 2 (T1 to T2)
    const bridge2Geo = new THREE.BoxGeometry(1.5, 0.15, 0.3)
    const bridge2 = new THREE.Mesh(bridge2Geo, bridgeMat)
    bridge2.position.set(1.0, 3.1, -1.2)
    bridge2.rotation.y = -0.3
    campusGroup.add(bridge2)

    // Bridge 3 (T3 to T4)
    const bridge3Geo = new THREE.BoxGeometry(1.7, 0.15, 0.3)
    const bridge3 = new THREE.Mesh(bridge3Geo, bridgeMat)
    bridge3.position.set(-0.5, 2.1, 1.3)
    bridge3.rotation.y = -0.1
    campusGroup.add(bridge3)

    // 9. Interactive Drag Orbit & Mouse Physics
    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0
    let rotationVelocityX = 0
    let rotationVelocityY = 0
    let targetRotationY = 0.5
    let currentRotationY = 0.5
    let targetRotationX = 0.1
    let currentRotationX = 0.1
    let isVisible = true
    let animationFrameId: number

    const raycaster = new THREE.Raycaster()
    const mouseCoord = new THREE.Vector2(-1000, -1000)

    const onPointerDown = (e: MouseEvent) => {
      isDragging = true
      prevMouseX = e.clientX
      prevMouseY = e.clientY
    }

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseCoord.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseCoord.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX
        const deltaY = e.clientY - prevMouseY
        prevMouseX = e.clientX
        prevMouseY = e.clientY

        rotationVelocityY += deltaX * 0.003
        rotationVelocityX += deltaY * 0.002
      }
    }

    const onPointerUp = () => {
      isDragging = false
    }

    const onClick = () => {
      raycaster.setFromCamera(mouseCoord, camera)
      const intersects = raycaster.intersectObjects(towerMeshes)
      if (intersects.length > 0) {
        const hitIndex = intersects[0].object.userData.index
        if (typeof hitIndex === 'number' && onSelectTower) {
          onSelectTower(hitIndex)
        }
      }
    }

    container.addEventListener('mousedown', onPointerDown)
    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('mouseup', onPointerUp)
    container.addEventListener('click', onClick)

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

    // 10. Animation Loop
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      if (!isVisible) return

      const elapsed = clock.getElapsedTime()

      // Idle subtle auto-rotation when not dragging
      if (!isDragging) {
        rotationVelocityY += 0.0003
      }

      // Damping
      rotationVelocityY *= 0.92
      rotationVelocityX *= 0.92

      targetRotationY += rotationVelocityY
      targetRotationX = Math.max(-0.25, Math.min(0.4, targetRotationX + rotationVelocityX))

      currentRotationY += (targetRotationY - currentRotationY) * 0.1
      currentRotationX += (targetRotationX - currentRotationX) * 0.1

      campusGroup.rotation.y = currentRotationY
      campusGroup.rotation.x = currentRotationX

      // Raycasting for tower hover
      raycaster.setFromCamera(mouseCoord, camera)
      const intersects = raycaster.intersectObjects(towerMeshes)
      if (intersects.length > 0) {
        const hitIdx = intersects[0].object.userData.index
        setHoveredTower(hitIdx)
      } else {
        setHoveredTower(null)
      }

      // Subtle breathing pulse on the blue accent light
      blueAccentLight.intensity = 2.0 + Math.sin(elapsed * 2) * 0.5

      renderer.render(scene, camera)
    }

    animate()

    // 11. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      container.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('mouseup', onPointerUp)
      container.removeEventListener('click', onClick)
      window.removeEventListener('resize', handleResize)
      observer.disconnect()

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }

      podiumGeo.dispose()
      podiumMat.dispose()
      glassMaterial.dispose()
      activeGlassMaterial.dispose()
      titaniumCoreMat.dispose()
      edgeLineMat.dispose()
      bridgeMat.dispose()
      renderer.dispose()
    }
  }, [activeTowerIndex, onSelectTower])

  if (!webglSupported) {
    return (
      <div
        className={className}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '480px',
          background: '#f8fafc',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #e2e8f0',
          padding: '24px',
          color: '#1d1d1f',
          textAlign: 'center',
        }}
      >
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '14px' }}>
          ST
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 6px 0' }}>Success Tunnel Spatial Campus</h3>
        <p style={{ color: '#86868b', fontSize: '0.9rem', maxWidth: '320px', margin: 0 }}>
          Coordinated multidisciplinary advisory across 6 enterprise towers.
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '480px',
        userSelect: 'none',
      }}
      className={className}
    >
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '480px',
          cursor: 'grab',
        }}
      />

      {/* Floating Spatial HUD Badge */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          borderRadius: '999px',
          padding: '6px 14px',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: '#1d1d1f',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
          pointerEvents: 'none',
        }}
      >
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }} />
        <span>Spatial Campus &bull; Drag to Rotate</span>
      </div>

      {/* Tower Live Hover Readout */}
      {hoveredTower !== null && campusTowers[hoveredTower] && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(29, 29, 31, 0.92)',
            backdropFilter: 'blur(16px)',
            color: '#ffffff',
            borderRadius: '12px',
            padding: '8px 16px',
            fontSize: '0.82rem',
            fontWeight: 600,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ color: '#93c5fd', fontWeight: 800 }}>{campusTowers[hoveredTower].code}</span>
          <span>{campusTowers[hoveredTower].name}</span>
        </div>
      )}
    </div>
  )
}
