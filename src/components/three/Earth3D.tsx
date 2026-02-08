// 3D Earth component using react-three-fiber
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

export function Earth3D() {
  const earthRef = useRef<THREE.Mesh>(null);

  // Slow rotation
  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group>
      {/* Earth sphere */}
      <Sphere ref={earthRef} args={[1, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#1a4a7a"
          emissive="#0a2a4a"
          emissiveIntensity={0.3}
          roughness={0.7}
          metalness={0.1}
        />
      </Sphere>

      {/* Atmosphere glow */}
      <Sphere args={[1.05, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#4a9eff"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Continents layer (subtle) */}
      <Sphere args={[1.002, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#2d8a4e"
          transparent
          opacity={0.25}
          roughness={1}
        />
      </Sphere>

      {/* Outer atmosphere */}
      <Sphere args={[1.15, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#4a9eff"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}
