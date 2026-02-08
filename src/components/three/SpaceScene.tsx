// Main 3D scene: Earth + nearest asteroid + lighting
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Earth3D } from "./Earth3D";
import { Asteroid3D } from "./Asteroid3D";
import type { Asteroid } from "@/types/asteroid";

interface SpaceSceneProps {
  asteroids: Asteroid[];
  selectedAsteroid: Asteroid | null;
  onSelectAsteroid: (asteroid: Asteroid) => void;
}

export function SpaceScene({ asteroids, selectedAsteroid, onSelectAsteroid }: SpaceSceneProps) {
  // Show up to 4 closest asteroids in the 3D scene
  const visibleAsteroids = [...asteroids]
    .sort((a, b) => a.miss_distance_km - b.miss_distance_km)
    .slice(0, 4);

  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 50 }}
      style={{ background: "transparent" }}
      gl={{ alpha: true }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-5, -3, -5]} intensity={0.4} color="#4a9eff" />

      {/* Stars background */}
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0.2} fade speed={1} />

      {/* Earth */}
      <Earth3D />

      {/* Orbit ring (visual guide) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.48, 2.52, 128]} />
        <meshBasicMaterial color="#4a9eff" transparent opacity={0.08} side={2} />
      </mesh>

      {/* Asteroids */}
      {visibleAsteroids.map((asteroid, i) => (
        <Asteroid3D
          key={asteroid.id}
          asteroid={asteroid}
          orbitRadius={2.2 + i * 0.5}
          speed={0.3 - i * 0.05}
          isSelected={selectedAsteroid?.id === asteroid.id}
          onSelect={onSelectAsteroid}
        />
      ))}

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={10}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </Canvas>
  );
}
