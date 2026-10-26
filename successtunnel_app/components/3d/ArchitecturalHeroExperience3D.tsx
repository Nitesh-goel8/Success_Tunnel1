import React, { useEffect, useRef, useState, useCallback } from 'react'
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
    x: -2.2,
    z: -1.2,
    accentColor: 0x2563eb,
    tagline: 'Corporate Advisory & Statutory Defense',
    description: 'Statutory compliance, income tax litigation, GST representation, MCA corporate governance, and merger restructuring.',
    keyStat: '100% Compliance',
    statLabel: 'Direct Statutory Defense',
    discipline: 'Corporate Advisory',
  },
  {
    id: 'capital-finance',
    name: 'Capital & Finance Spire',
    code: 'TOWER 02',
    height: 6.6,
    x: 0.4,
    z: -1.8,
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
    x: 2.6,
    z: -0.8,
    accentColor: 0x3b82f6,
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
    x: -1.8,
    z: 1.6,
    accentColor: 0x6366f1,
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
    x: 0.6,
    z: 1.8,
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
    x: 2.5,
    z: 1.4,
    accentColor: 0x4f46e5,
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
  isTwilightMode?: boolean
  autoTourEnabled?: boolean
  onToggleAutoTour?: () => void
  onToggleLighting?: () => void
  className?: string
}

export default function ArchitecturalHeroExperience3D({
  activeTowerIndex = 0,
  onSelectTower,
  isTwilightMode = false,
  autoTourEnabled = true,
  onToggleAutoTour,
  onToggleLighting,
  className,
}: ArchitecturalHeroExperience3DProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [webglAvailable, setWebglAvailable] = useState(true)
  const [hoveredTower, setHoveredTower] = useState<number | null>(null)

  // References for live 3D interaction without recreation
  const activeTowerRef = useRef(activeTowerIndex)
  activeTowerRef.current = activeTowerIndex

  const isTwilightRef = useRef(isTwilightMode)
  isTwilightRef.current = isTwilightMode

  const autoTourRef = useRef(autoTourEnabled)
  autoTourRef.current = autoTourEnabled

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

    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || 750

    // 2. Three.js Scene Setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(isTwilightRef.current ? 0x050814 : 0xf8fafc, 0.028)

    // Camera with cinematic isometric angle
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100)
    camera.position.set(11, 9, 13)
    camera.lookAt(0, 2.0, 0)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = isTwilightRef.current ? 1.35 : 1.15
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // 3. Dynamic Studio & Architectural Lighting
    const ambientLight = new THREE.AmbientLight(
      isTwilightRef.current ? 0x1e293b : 0xffffff,
      isTwilightRef.current ? 1.8 : 1.5
    )
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(
      isTwilightRef.current ? 0x60a5fa : 0xffffff,
      isTwilightRef.current ? 2.8 : 2.4
    )
    sunLight.position.set(14, 22, 12)
    sunLight.castShadow = true
    sunLight.shadow.mapSize.width = 1024
    sunLight.shadow.mapSize.height = 1024
    sunLight.shadow.bias = -0.0004
    sunLight.shadow.camera.near = 1
    sunLight.shadow.camera.far = 50
    sunLight.shadow.camera.left = -10
    sunLight.shadow.camera.right = 10
    sunLight.shadow.camera.top = 10
    sunLight.shadow.camera.bottom = -10
    scene.add(sunLight)

    const blueRimLight = new THREE.DirectionalLight(0x3b82f6, isTwilightRef.current ? 2.5 : 1.2)
    blueRimLight.position.set(-12, 10, -10)
    scene.add(blueRimLight)

    const cyanFloorGlow = new THREE.PointLight(0x06b6d4, isTwilightRef.current ? 3.0 : 1.6, 22, 1.2)
    cyanFloorGlow.position.set(0, 1.5, 0)
    scene.add(cyanFloorGlow)

    // Sweeping Searchlight / Beacon
    const searchLight = new THREE.SpotLight(0x93c5fd, 4, 30, Math.PI / 8, 0.4, 1.5)
    searchLight.position.set(0, 12, 0)
    searchLight.target.position.set(0, 0, 0)
    scene.add(searchLight)
    scene.add(searchLight.target)

    // 4. Campus Group Container
    const campusGroup = new THREE.Group()
    scene.add(campusGroup)

    // 5. Reflective Holographic Podium Base
    const podiumGeo = new THREE.CylinderGeometry(6.8, 7.2, 0.3, 48)
    const podiumMat = new THREE.MeshStandardMaterial({
      color: isTwilightRef.current ? 0x090d16 : 0xffffff,
      roughness: 0.1,
      metalness: 0.2,
    })
    const podiumMesh = new THREE.Mesh(podiumGeo, podiumMat)
    podiumMesh.position.y = -0.15
    podiumMesh.receiveShadow = true
    campusGroup.add(podiumMesh)

    // Circular Holographic Floor Rings
    const ringGeo1 = new THREE.RingGeometry(3.5, 3.54, 64)
    const ringGeo2 = new THREE.RingGeometry(5.8, 5.85, 64)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: isTwilightRef.current ? 0.7 : 0.4,
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

    // Grid Plane
    const grid = new THREE.GridHelper(12, 24, 0x0284c7, isTwilightRef.current ? 0x1e293b : 0xe2e8f0)
    grid.position.y = 0.01
    campusGroup.add(grid)

    // 6. Materials for Modern Architectural Glass & Titanium
    const defaultGlassMat = new THREE.MeshPhysicalMaterial({
      color: isTwilightRef.current ? 0x1e293b : 0xf8fafc,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.7,
      thickness: 1.5,
      transparent: true,
      opacity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    })

    const activeGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xeff6ff,
      emissive: 0x2563eb,
      emissiveIntensity: 0.5,
      metalness: 0.3,
      roughness: 0.05,
      transmission: 0.6,
      thickness: 1.8,
      transparent: true,
      opacity: 0.95,
      clearcoat: 1.0,
    })

    const titaniumRibMat = new THREE.MeshStandardMaterial({
      color: isTwilightRef.current ? 0x0f172a : 0x1e3a8a,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0x1e40af,
      emissiveIntensity: isTwilightRef.current ? 0.3 : 0.15,
    })

    const wireframeEdgeMat = new THREE.LineBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: isTwilightRef.current ? 0.85 : 0.5,
    })

    const activeWireframeEdgeMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 2,
      transparent: true,
      opacity: 1.0,
    })

    // 7. Construct Architectural Skyscraper Towers
    const towerMeshes: THREE.Mesh[] = []
    const towerGroups: THREE.Group[] = []
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

      // Inner Illuminated Slabs / Core Columns (creates realistic skyscraper floor lights)
      const floorsCount = Math.floor(tower.height * 3.5)
      for (let f = 1; f < floorsCount; f++) {
        const floorGeo = new THREE.BoxGeometry(towerWidth * 0.92, 0.04, towerDepth * 0.92)
        const floorMat = new THREE.MeshBasicMaterial({
          color: isSelected ? 0x60a5fa : (isTwilightRef.current ? 0x38bdf8 : 0x93c5fd),
          transparent: true,
          opacity: 0.45,
        })
        const floorMesh = new THREE.Mesh(floorGeo, floorMat)
        floorMesh.position.y = (f / floorsCount) * tower.height
        tGroup.add(floorMesh)
      }

      // Internal Core Elevator / Shear Wall
      const coreGeo = new THREE.BoxGeometry(towerWidth * 0.42, tower.height * 0.98, towerDepth * 0.42)
      const coreMesh = new THREE.Mesh(coreGeo, titaniumRibMat)
      coreMesh.position.y = (tower.height * 0.98) / 2
      tGroup.add(coreMesh)

      // Architectural Edge Outline
      const edgesGeo = new THREE.EdgesGeometry(outerGeo)
      const edgesMesh = new THREE.LineSegments(edgesGeo, isSelected ? activeWireframeEdgeMat : wireframeEdgeMat)
      edgesMesh.position.y = tower.height / 2
      tGroup.add(edgesMesh)

      // Rooftop Setback & Beacon Spire
      const crownGeo = new THREE.BoxGeometry(towerWidth * 0.7, 0.35, towerDepth * 0.7)
      const crownMesh = new THREE.Mesh(crownGeo, titaniumRibMat)
      crownMesh.position.y = tower.height + 0.175
      tGroup.add(crownMesh)

      const spireGeo = new THREE.CylinderGeometry(0.015, 0.06, 0.75, 8)
      const spireMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        metalness: 0.95,
        emissive: 0x0284c7,
        emissiveIntensity: 0.6,
      })
      const spire = new THREE.Mesh(spireGeo, spireMat)
      spire.position.y = tower.height + 0.35 + 0.375
      tGroup.add(spire)

      // Rooftop Pulsing Light Beacon
      const beaconLight = new THREE.PointLight(tower.accentColor, isSelected ? 3.5 : 1.2, 5, 2)
      beaconLight.position.y = tower.height + 0.8
      tGroup.add(beaconLight)
      towerBeacons.push(beaconLight)

      campusGroup.add(tGroup)
      towerGroups.push(tGroup)
    })

    // 8. Connecting Architectural Skybridges between Towers
    const bridgeMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.7,
      roughness: 0.15,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85,
    })

    const createSkybridge = (x: number, y: number, z: number, length: number, rotY: number) => {
      const bGeo = new THREE.BoxGeometry(length, 0.22, 0.35)
      const bMesh = new THREE.Mesh(bGeo, bridgeMat)
      bMesh.position.set(x, y, z)
      bMesh.rotation.y = rotY
      bMesh.castShadow = true
      campusGroup.add(bMesh)

      // Bridge Edge Lines
      const bEdgeGeo = new THREE.EdgesGeometry(bGeo)
      const bEdge = new THREE.LineSegments(bEdgeGeo, wireframeEdgeMat)
      bEdge.position.set(x, y, z)
      bEdge.rotation.y = rotY
      campusGroup.add(bEdge)
    }

    createSkybridge(-0.9, 3.2, -1.5, 1.9, 0.22) // Tower 0 to 1
    createSkybridge(1.5, 3.8, -1.3, 1.8, -0.35) // Tower 1 to 2
    createSkybridge(-0.6, 2.6, 1.7, 1.8, -0.15) // Tower 3 to 4
    createSkybridge(1.5, 2.8, 1.6, 1.7, 0.2) // Tower 4 to 5

    // 9. Ambient Floating Data Stream Particles
    const particleCount = 180
    const particleGeo = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 12
      particlePositions[i * 3 + 1] = Math.random() * 8 + 0.2
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 12
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    })
    const particleSystem = new THREE.Points(particleGeo, particleMat)
    campusGroup.add(particleSystem)

    // 10. Interactive Drag, Orbit, and Click Raycasting
    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0
    let rotationVelocityX = 0
    let rotationVelocityY = 0
    let targetRotationY = 0.4
    let currentRotationY = 0.4
    let targetRotationX = 0.1
    let currentRotationX = 0.1
    let isVisible = true
    let animationFrameId: number

    // Target Camera glide position
    const cameraTargetPos = new THREE.Vector3(11, 9, 13)
    const cameraLookAtTarget = new THREE.Vector3(0, 2.0, 0)
    const currentCameraLookAt = new THREE.Vector3(0, 2.0, 0)

    const raycaster = new THREE.Raycaster()
    const mouseCoord = new THREE.Vector2(-1000, -1000)

    const updateCameraForTower = (idx: number) => {
      const t = campusTowersData[idx]
      if (!t) return

      // Smooth offset positioning to highlight the active tower
      cameraTargetPos.set(
        t.x + (t.x >= 0 ? 5.5 : -5.5),
        t.height * 0.8 + 4.5,
        t.z + 7.5
      )
      cameraLookAtTarget.set(t.x, t.height * 0.5, t.z)
    }

    // Initialize camera position based on active tower
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

    // Visibility observer to save battery when off-screen
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting
        })
      },
      { threshold: 0.05 }
    )
    observer.observe(container)

    // 11. Animation Loop
    const clock = new THREE.Clock()
    let lastAutoTourStep = 0

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      if (!isVisible) return

      const elapsed = clock.getElapsedTime()

      // Auto-Tour Camera Cycling (every 6 seconds if enabled and user is not dragging)
      if (autoTourRef.current && !isDragging && elapsed - lastAutoTourStep > 6.5) {
        lastAutoTourStep = elapsed
        const nextIdx = (activeTowerRef.current + 1) % campusTowersData.length
        onSelectTower(nextIdx)
      }

      // Smooth camera interpolation towards target
      camera.position.lerp(cameraTargetPos, 0.035)
      currentCameraLookAt.lerp(cameraLookAtTarget, 0.035)
      camera.lookAt(currentCameraLookAt)

      // Smooth rotation dampening
      if (!isDragging && !autoTourRef.current) {
        rotationVelocityY += 0.0002
      }

      rotationVelocityY *= 0.93
      rotationVelocityX *= 0.93

      targetRotationY += rotationVelocityY
      targetRotationX = Math.max(-0.2, Math.min(0.35, targetRotationX + rotationVelocityX))

      currentRotationY += (targetRotationY - currentRotationY) * 0.08
      currentRotationX += (targetRotationX - currentRotationX) * 0.08

      campusGroup.rotation.y = currentRotationY
      campusGroup.rotation.x = currentRotationX

      // Floating particles slow upward ascent
      const positions = particleGeo.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += 0.008
        if (positions[i * 3 + 1] > 8.5) {
          positions[i * 3 + 1] = 0.2
        }
      }
      particleGeo.attributes.position.needsUpdate = true

      // Sweeping searchlight rotation
      searchLight.position.x = Math.sin(elapsed * 0.6) * 5
      searchLight.position.z = Math.cos(elapsed * 0.6) * 5

      // Pulsing rooftop beacons
      towerBeacons.forEach((b, i) => {
        const isCurrent = i === activeTowerRef.current
        b.intensity = (isCurrent ? 3.0 : 1.0) + Math.sin(elapsed * 3 + i) * 0.6
      })

      // Raycasting hover state
      raycaster.setFromCamera(mouseCoord, camera)
      const hits = raycaster.intersectObjects(towerMeshes)
      if (hits.length > 0) {
        const idx = hits[0].object.userData.index
        setHoveredTower(idx)
        container.style.cursor = 'pointer'
      } else {
        setHoveredTower(null)
        container.style.cursor = isDragging ? 'grabbing' : 'grab'
      }

      // Update active materials live
      towerMeshes.forEach((m, i) => {
        const isCur = i === activeTowerRef.current
        m.material = isCur ? activeGlassMat : defaultGlassMat
      })

      renderer.render(scene, camera)
    }

    animate()

    // 12. Cleanup on Unmount
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
      ringGeo1.dispose()
      ringGeo2.dispose()
      ringMat.dispose()
      defaultGlassMat.dispose()
      activeGlassMat.dispose()
      titaniumRibMat.dispose()
      wireframeEdgeMat.dispose()
      activeWireframeEdgeMat.dispose()
      bridgeMat.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      renderer.dispose()
    }
  }, [onSelectTower])

  // Trigger camera update whenever activeTowerIndex changes
  useEffect(() => {
    activeTowerRef.current = activeTowerIndex
  }, [activeTowerIndex])

  if (!webglAvailable) {
    return (
      <div
        className={className}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '600px',
          background: isTwilightMode ? '#0a0f1d' : '#f8fafc',
          borderRadius: '28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: isTwilightMode ? '#f1f5f9' : '#1d1d1f',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem', marginBottom: '1rem' }}>
          ST
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Success Tunnel Spatial Campus</h3>
        <p style={{ color: '#86868b', fontSize: '0.95rem', maxWidth: '420px', margin: 0 }}>
          Interactive multi-tower 3D architecture for corporate advisory, debt syndication, and prime commercial real estate.
        </p>
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
        zIndex: 1,
        touchAction: 'none',
      }}
    />
  )
}
