import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export interface TowerData {
  id: string
  name: string
  code: string
  height: number
  x: number
  z: number
  accentColor: number
  tagline: string
  description: string
  keyStat: string
  statLabel: string
  discipline: string
}

export const campusTowersData: TowerData[] = [
  {
    id: 'sudarshan-advisory',
    name: 'Sudarshan Tower',
    code: 'TOWER 01',
    height: 5.4,
    x: -2.0,
    z: -0.8,
    accentColor: 0x0071e3,
    tagline: 'Corporate Advisory & Statutory Defense',
    description: 'Statutory compliance, income tax litigation, GST representation, MCA corporate governance, and corporate restructuring.',
    keyStat: '100% Compliance',
    statLabel: 'Direct Statutory Defense',
    discipline: 'Corporate Advisory',
  },
  {
    id: 'capital-finance',
    name: 'Capital & Finance Spire',
    code: 'TOWER 02',
    height: 6.6,
    x: 0.3,
    z: -1.6,
    accentColor: 0x0284c7,
    tagline: 'Institutional Debt & Credit Syndication',
    description: 'Working capital syndication, CMA preparation, consortium debt structuring, and structured term credit for expanding enterprises.',
    keyStat: '₹500Cr+ Syndicated',
    statLabel: 'Corporate Debt Facilitation',
    discipline: 'Corporate Finance',
  },
  {
    id: 'real-estate-plaza',
    name: 'Commercial Real Estate Plaza',
    code: 'TOWER 03',
    height: 5.0,
    x: 2.4,
    z: -0.6,
    accentColor: 0x0071e3,
    tagline: 'Prime Commercial Asset Acquisition',
    description: 'High-street retail portfolio acquisition, prime commercial land title vetting, industrial leasing, and long-term asset management.',
    keyStat: '250,000+ Sq.Ft.',
    statLabel: 'Commercial Portfolio Vetted',
    discipline: 'Commercial Real Estate',
  },
  {
    id: 'managed-workspaces',
    name: 'Sudarshan Executive Chambers',
    code: 'TOWER 04',
    height: 4.2,
    x: -1.6,
    z: 1.6,
    accentColor: 0x4f46e5,
    tagline: 'Furnished Executive Suites & Boardrooms',
    description: 'Private furnished office suites, conference boardrooms, and plug-and-play corporate workspaces at Sudarshan Tower, Panipat.',
    keyStat: 'Level 1 Fitted',
    statLabel: 'Ready-to-Deploy Chambers',
    discipline: 'Managed Workspaces',
  },
  {
    id: 'treasury-pavilion',
    name: 'Treasury & Investment Hub',
    code: 'TOWER 05',
    height: 4.8,
    x: 0.5,
    z: 1.7,
    accentColor: 0x0ea5e9,
    tagline: 'Capital Preservation & Asset Allocation',
    description: 'Corporate treasury discipline, asset protection strategies, low-risk capital preservation, and institutional investment governance.',
    keyStat: 'Multi-Tenant RBAC',
    statLabel: 'Institutional Security Standards',
    discipline: 'Investment Advisory',
  },
  {
    id: 'executive-academy',
    name: 'Executive Education Wing',
    code: 'TOWER 06',
    height: 3.6,
    x: 2.3,
    z: 1.3,
    accentColor: 0x6366f1,
    tagline: 'Corporate Taxation & GST Masterclasses',
    description: 'Accredited executive training in corporate taxation, GST litigation defense, balance sheet analysis, and financial leadership.',
    keyStat: '1,200+ Trained',
    statLabel: 'Enterprise Professionals Upskilled',
    discipline: 'Executive Education',
  },
]

interface ArchitecturalHeroExperience3DProps {
  activeTowerIndex: number
  onSelectTower: (index: number) => void
  className?: string
}

export default function ArchitecturalHeroExperience3D({
  activeTowerIndex = 0,
  onSelectTower,
  className,
}: ArchitecturalHeroExperience3DProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [webglAvailable, setWebglAvailable] = useState(true)
  const activeTowerRef = useRef(activeTowerIndex)
  const updateCameraRef = useRef<((idx: number) => void) | null>(null)

  // Keep ref up to date and trigger camera move when activeTowerIndex changes
  useEffect(() => {
    activeTowerRef.current = activeTowerIndex
    if (updateCameraRef.current) {
      updateCameraRef.current(activeTowerIndex)
    }
  }, [activeTowerIndex])

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // 1. Verify WebGL availability
    try {
      const c = document.createElement('canvas')
      const gl = c.getContext('webgl') || c.getContext('experimental-webgl')
      if (!gl) {
        setWebglAvailable(false)
        return
      }
    } catch {
      setWebglAvailable(false)
      return
    }

    const width = container.clientWidth || 600
    const height = container.clientHeight || 500

    // 2. Three.js Scene Setup (Clean Architectural Daylight Studio)
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.015)

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.set(10.5, 8.5, 12.5)
    camera.lookAt(0, 1.8, 0)

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

    // 3. Crisp Architectural Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2)
    sunLight.position.set(15, 20, 12)
    sunLight.castShadow = true
    sunLight.shadow.mapSize.width = 1024
    sunLight.shadow.mapSize.height = 1024
    sunLight.shadow.bias = -0.0003
    scene.add(sunLight)

    const skyFillLight = new THREE.DirectionalLight(0x93c5fd, 1.2)
    skyFillLight.position.set(-12, 12, -8)
    scene.add(skyFillLight)

    const cyanPointLight = new THREE.PointLight(0x0071e3, 2.2, 18, 1.2)
    cyanPointLight.position.set(0, 2.0, 0)
    scene.add(cyanPointLight)

    // 4. Campus Group Container
    const campusGroup = new THREE.Group()
    scene.add(campusGroup)

    // 5. Reflective Holographic Podium Plinth
    const podiumGeo = new THREE.CylinderGeometry(6.6, 7.0, 0.25, 48)
    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.1,
    })
    const podiumMesh = new THREE.Mesh(podiumGeo, podiumMat)
    podiumMesh.position.y = -0.125
    podiumMesh.receiveShadow = true
    campusGroup.add(podiumMesh)

    // Concentric Blueprint Rings on Plinth
    const ringGeo1 = new THREE.RingGeometry(3.4, 3.44, 64)
    const ringGeo2 = new THREE.RingGeometry(5.6, 5.64, 64)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x0071e3,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    })
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat)
    ringMesh1.rotation.x = -Math.PI / 2
    ringMesh1.position.y = 0.02
    campusGroup.add(ringMesh1)

    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat)
    ringMesh2.rotation.x = -Math.PI / 2
    ringMesh2.position.y = 0.02
    campusGroup.add(ringMesh2)

    // Subtle Architectural Grid
    const grid = new THREE.GridHelper(12, 24, 0x0071e3, 0xe2e8f0)
    grid.position.y = 0.01
    campusGroup.add(grid)

    // 6. Materials for Architectural Crystal Glass & Titanium Frame
    const defaultGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.08,
      transmission: 0.85,
      thickness: 1.4,
      transparent: true,
      opacity: 0.88,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    })

    const activeGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xeff6ff,
      emissive: 0x0071e3,
      emissiveIntensity: 0.45,
      metalness: 0.25,
      roughness: 0.05,
      transmission: 0.65,
      thickness: 1.6,
      transparent: true,
      opacity: 0.95,
      clearcoat: 1.0,
    })

    const titaniumRibMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.2,
    })

    const wireframeEdgeMat = new THREE.LineBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.6,
    })

    const activeWireframeEdgeMat = new THREE.LineBasicMaterial({
      color: 0x0071e3,
      transparent: true,
      opacity: 1.0,
    })

    // 7. Construct Architectural Skyscraper Towers
    const towerMeshes: THREE.Mesh[] = []
    const towerBeacons: THREE.PointLight[] = []

    campusTowersData.forEach((tower, idx) => {
      const tGroup = new THREE.Group()
      tGroup.position.set(tower.x, 0, tower.z)

      const towerWidth = 1.15
      const towerDepth = 1.15
      const isSelected = idx === activeTowerRef.current

      // Outer Facade Box
      const outerGeo = new THREE.BoxGeometry(towerWidth, tower.height, towerDepth)
      const outerMesh = new THREE.Mesh(outerGeo, isSelected ? activeGlassMat : defaultGlassMat)
      outerMesh.position.y = tower.height / 2
      outerMesh.castShadow = true
      outerMesh.receiveShadow = true
      outerMesh.userData = { index: idx, id: tower.id }
      tGroup.add(outerMesh)
      towerMeshes.push(outerMesh)

      // Inner Slabs (creates realistic skyscraper floor lights)
      const floorsCount = Math.floor(tower.height * 3.2)
      for (let f = 1; f < floorsCount; f++) {
        const floorGeo = new THREE.BoxGeometry(towerWidth * 0.92, 0.035, towerDepth * 0.92)
        const floorMat = new THREE.MeshBasicMaterial({
          color: isSelected ? 0x0071e3 : 0xbfdbfe,
          transparent: true,
          opacity: 0.4,
        })
        const floorMesh = new THREE.Mesh(floorGeo, floorMat)
        floorMesh.position.y = (f / floorsCount) * tower.height
        tGroup.add(floorMesh)
      }

      // Internal Core Elevator / Shear Column
      const coreGeo = new THREE.BoxGeometry(towerWidth * 0.38, tower.height * 0.96, towerDepth * 0.38)
      const coreMesh = new THREE.Mesh(coreGeo, titaniumRibMat)
      coreMesh.position.y = (tower.height * 0.96) / 2
      tGroup.add(coreMesh)

      // Architectural Edge Outline
      const edgesGeo = new THREE.EdgesGeometry(outerGeo)
      const edgesMesh = new THREE.LineSegments(edgesGeo, isSelected ? activeWireframeEdgeMat : wireframeEdgeMat)
      edgesMesh.position.y = tower.height / 2
      tGroup.add(edgesMesh)

      // Rooftop Setback & Beacon Spire
      const crownGeo = new THREE.BoxGeometry(towerWidth * 0.65, 0.3, towerDepth * 0.65)
      const crownMesh = new THREE.Mesh(crownGeo, titaniumRibMat)
      crownMesh.position.y = tower.height + 0.15
      tGroup.add(crownMesh)

      const spireGeo = new THREE.CylinderGeometry(0.015, 0.05, 0.7, 8)
      const spireMat = new THREE.MeshStandardMaterial({
        color: 0x0071e3,
        metalness: 0.9,
        emissive: 0x0071e3,
        emissiveIntensity: 0.5,
      })
      const spire = new THREE.Mesh(spireGeo, spireMat)
      spire.position.y = tower.height + 0.3 + 0.35
      tGroup.add(spire)

      // Rooftop Beacon Light
      const beaconLight = new THREE.PointLight(tower.accentColor, isSelected ? 3.0 : 0.8, 5, 2)
      beaconLight.position.y = tower.height + 0.75
      tGroup.add(beaconLight)
      towerBeacons.push(beaconLight)

      campusGroup.add(tGroup)
    })

    // 8. Connecting Architectural Skybridges between Towers
    const bridgeMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.8,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
    })

    const createSkybridge = (x: number, y: number, z: number, length: number, rotY: number) => {
      const bGeo = new THREE.BoxGeometry(length, 0.2, 0.32)
      const bMesh = new THREE.Mesh(bGeo, bridgeMat)
      bMesh.position.set(x, y, z)
      bMesh.rotation.y = rotY
      bMesh.castShadow = true
      campusGroup.add(bMesh)

      const bEdgeGeo = new THREE.EdgesGeometry(bGeo)
      const bEdge = new THREE.LineSegments(bEdgeGeo, wireframeEdgeMat)
      bEdge.position.set(x, y, z)
      bEdge.rotation.y = rotY
      campusGroup.add(bEdge)
    }

    createSkybridge(-0.85, 3.2, -1.2, 1.8, 0.2)
    createSkybridge(1.35, 3.8, -1.1, 1.8, -0.3)
    createSkybridge(-0.55, 2.6, 1.6, 1.8, -0.15)
    createSkybridge(1.4, 2.8, 1.5, 1.7, 0.2)

    // 9. Interactive Drag & Camera Targeting
    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0
    let rotationVelocityX = 0
    let rotationVelocityY = 0
    let targetRotationY = 0.35
    let currentRotationY = 0.35
    let targetRotationX = 0.08
    let currentRotationX = 0.08
    let isVisible = true
    let animationFrameId: number

    const cameraTargetPos = new THREE.Vector3(10.5, 8.5, 12.5)
    const cameraLookAtTarget = new THREE.Vector3(0, 1.8, 0)
    const currentCameraLookAt = new THREE.Vector3(0, 1.8, 0)

    const raycaster = new THREE.Raycaster()
    const mouseCoord = new THREE.Vector2(-1000, -1000)

    const updateCameraForTower = (idx: number) => {
      const t = campusTowersData[idx]
      if (!t) return

      // Smooth camera repositioning to frame active tower
      cameraTargetPos.set(
        t.x + (t.x >= 0 ? 5.2 : -5.2),
        t.height * 0.75 + 4.2,
        t.z + 7.2
      )
      cameraLookAtTarget.set(t.x, t.height * 0.45, t.z)
    }

    // Attach function to ref for external prop updates
    updateCameraRef.current = updateCameraForTower
    updateCameraForTower(activeTowerRef.current)

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
        const hitIdx = intersects[0].object.userData.index
        if (typeof hitIdx === 'number') {
          onSelectTower(hitIdx)
        }
      }
    }

    container.addEventListener('mousedown', onPointerDown)
    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('mouseup', onPointerUp)
    container.addEventListener('click', onClick)

    const handleResize = () => {
      if (!container) return
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }
    window.addEventListener('resize', handleResize)

    // Visibility observer to pause loop when offscreen
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting
        })
      },
      { threshold: 0.05 }
    )
    observer.observe(container)

    // 10. Smooth Cinematic Animation Loop
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      if (!isVisible) return

      const elapsed = clock.getElapsedTime()

      // Smooth camera interpolation towards active tower target
      camera.position.lerp(cameraTargetPos, 0.035)
      currentCameraLookAt.lerp(cameraLookAtTarget, 0.035)
      camera.lookAt(currentCameraLookAt)

      // Gentle continuous ambient rotation when user is not dragging
      if (!isDragging) {
        rotationVelocityY += 0.00035
      }

      rotationVelocityY *= 0.94
      rotationVelocityX *= 0.94

      targetRotationY += rotationVelocityY
      targetRotationX = Math.max(-0.15, Math.min(0.3, targetRotationX + rotationVelocityX))

      currentRotationY += (targetRotationY - currentRotationY) * 0.08
      currentRotationX += (targetRotationX - currentRotationX) * 0.08

      campusGroup.rotation.y = currentRotationY
      campusGroup.rotation.x = currentRotationX

      // Pulsing rooftop beacons
      towerBeacons.forEach((b, i) => {
        const isCurrent = i === activeTowerRef.current
        b.intensity = (isCurrent ? 2.8 : 0.8) + Math.sin(elapsed * 2.5 + i) * 0.5
      })

      // Raycasting hover cursor
      raycaster.setFromCamera(mouseCoord, camera)
      const hits = raycaster.intersectObjects(towerMeshes)
      if (hits.length > 0) {
        container.style.cursor = 'pointer'
      } else {
        container.style.cursor = isDragging ? 'grabbing' : 'grab'
      }

      // Update active tower materials live
      towerMeshes.forEach((m, i) => {
        const isCur = i === activeTowerRef.current
        m.material = isCur ? activeGlassMat : defaultGlassMat
      })

      renderer.render(scene, camera)
    }

    animate()

    // 11. Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId)
      updateCameraRef.current = null
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
      ringGeo1.dispose()
      ringGeo2.dispose()
      ringMat.dispose()
      defaultGlassMat.dispose()
      activeGlassMat.dispose()
      titaniumRibMat.dispose()
      wireframeEdgeMat.dispose()
      activeWireframeEdgeMat.dispose()
      bridgeMat.dispose()
      renderer.dispose()
    }
  }, [onSelectTower])

  if (!webglAvailable) {
    return (
      <div
        className={className}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '420px',
          background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏛️</div>
        <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 700, color: '#0f172a' }}>
          Sudarshan Tower Architectural Chambers
        </h4>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', maxWidth: '340px' }}>
          Panipat Corporate Advisory, Finance & Commercial Real Estate Ecosystem.
        </p>
      </div>
    )
  }

  return (
    <div
      ref={mountRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        touchAction: 'none',
      }}
    />
  )
}
