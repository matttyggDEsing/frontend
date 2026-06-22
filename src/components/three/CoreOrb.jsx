import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Icosahedron, MeshDistortMaterial } from '@react-three/drei'

/**
 * El "núcleo" de la escena: una esfera distorsionada tipo líquido/glass
 * con glow esmeralda, representando el motor de NexaPanel. Solo maneja
 * su animación local (rotación + pulso interno) — la migración de
 * posición/escala por scroll vive en el <SceneRig> de LandingScene para
 * que el orbe y los anillos de NetworkNodes se muevan perfectamente
 * sincronizados.
 */
export default function CoreOrb() {
  const meshRef = useRef()
  const innerRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.08
      meshRef.current.rotation.y = t * 0.12
    }
    if (innerRef.current) {
      const pulse = 0.6 + Math.sin(t * 1.4) * 0.06
      innerRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group>
      {/* Cáscara distorsionada tipo vidrio líquido */}
      <Icosahedron ref={meshRef} args={[1.5, 9]}>
        <MeshDistortMaterial
          color="#0B1117"
          emissive="#10B981"
          emissiveIntensity={0.5}
          roughness={0.18}
          metalness={0.65}
          distort={0.42}
          speed={1.3}
        />
      </Icosahedron>

      {/* Núcleo interno brillante */}
      <mesh ref={innerRef} scale={0.6}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#34D399" transparent opacity={0.3} toneMapped={false} />
      </mesh>
    </group>
  )
}
