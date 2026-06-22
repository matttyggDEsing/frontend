import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

// Mismos colores que el array NETWORKS de LandingPage — Instagram, TikTok,
// YouTube, Spotify, Telegram, Facebook — para que el 3D "sea" literalmente
// la sección de plataformas soportadas.
const NODES = [
  { color: '#E1306C', radius: 3.0, speed: 0.18, offset: 0.0, tilt: 0.18, tiltY: 0.1 },
  { color: '#69C9D0', radius: 3.55, speed: -0.14, offset: 1.1, tilt: -0.28, tiltY: 0.6 },
  { color: '#FF0000', radius: 2.6, speed: 0.22, offset: 2.4, tilt: 0.42, tiltY: 1.1 },
  { color: '#1DB954', radius: 3.25, speed: -0.17, offset: 3.6, tilt: -0.1, tiltY: 1.7 },
  { color: '#2AABEE', radius: 2.85, speed: 0.15, offset: 4.7, tilt: 0.32, tiltY: 2.3 },
  { color: '#1877F2', radius: 3.4, speed: -0.12, offset: 5.5, tilt: -0.36, tiltY: 2.9 },
]

const RING_SEGMENTS = 72

function OrbitRing({ color, radius, speed, offset, tilt, tiltY }) {
  const nodeRef = useRef()
  const haloRef = useRef()

  const points = useMemo(() => {
    const pts = []
    for (let i = 0; i <= RING_SEGMENTS; i++) {
      const a = (i / RING_SEGMENTS) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius))
    }
    return pts
  }, [radius])

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed + offset
    const x = Math.cos(t) * radius
    const z = Math.sin(t) * radius
    if (nodeRef.current) nodeRef.current.position.set(x, 0, z)
    if (haloRef.current) haloRef.current.position.set(x, 0, z)
  })

  return (
    <group rotation={[tilt, tiltY, 0]}>
      <Line points={points} color={color} transparent opacity={0.16} lineWidth={1} />
      <mesh ref={nodeRef}>
        <sphereGeometry args={[0.085, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {/* halo suave detrás del nodo para reforzar el bloom */}
      <mesh ref={haloRef} scale={2.6}>
        <sphereGeometry args={[0.085, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} toneMapped={false} />
      </mesh>
    </group>
  )
}

/**
 * Conjunto de anillos orbitales alrededor del CoreOrb. Al avanzar el
 * scroll (`progress`) toda la formación se expande levemente y gira más
 * rápido, dando sensación de "crecimiento" — coherente con el copy de
 * la landing ("Crecé sin límites").
 */
export default function NetworkNodes({ progress = 0 }) {
  const groupRef = useRef()

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * (0.05 + progress * 0.05)
    const targetScale = THREE.MathUtils.lerp(1, 1.3, progress)
    const s = groupRef.current.scale
    s.setScalar(THREE.MathUtils.lerp(s.x, targetScale, 0.05))
  })

  return (
    <group ref={groupRef}>
      {NODES.map((n, i) => (
        <OrbitRing key={i} {...n} />
      ))}
    </group>
  )
}
