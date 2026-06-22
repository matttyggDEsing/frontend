import { Sparkles } from '@react-three/drei'

/**
 * Polvo de partículas glow para dar profundidad/atmósfera. Se omite por
 * completo en dispositivos de bajo rendimiento (ver LandingScene).
 */
export default function AmbientParticles() {
  return (
    <Sparkles
      count={140}
      scale={[16, 11, 9]}
      size={1.6}
      speed={0.25}
      opacity={0.45}
      color="#34D399"
      noise={1}
    />
  )
}
