// 3D asteroid orbiting Earth with axis helpers on hover
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Html } from "@react-three/drei";
import * as THREE from "three";
import type { Asteroid } from "@/types/asteroid";
import { getRiskLevel } from "@/types/asteroid";
import { AxisHelper } from "./AxisHelper";

interface Asteroid3DProps {
  asteroid: Asteroid;
  orbitRadius?: number;
  speed?: number;
  isSelected?: boolean;
  onSelect?: (asteroid: Asteroid) => void;
}

function getAsteroidColor(level: string): string {
  switch (level) {
    case "DANGEROUS": return "#ef4444"; // Red
    case "HAZARDOUS": return "#f97316"; // Orange
    case "PROBLEMATIC": return "#f59e0b"; // Yellow
    case "HIGH": return "#f97316"; // Orange
    case "MEDIUM": return "#f59e0b"; // Yellow
    default: return "#22c55e"; // Green (SAFE/LOW)
  }
}

function getAsteroidGlow(level: string): string {
  switch (level) {
    case "DANGEROUS": return "#ff6b6b";
    case "HAZARDOUS": return "#fb923c";
    case "PROBLEMATIC": return "#fbbf24";
    case "HIGH": return "#fb923c";
    case "MEDIUM": return "#fbbf24";
    default: return "#4ade80";
  }
}

export function Asteroid3D({
  asteroid,
  orbitRadius = 2.5,
  speed = 0.3,
  isSelected = false,
  onSelect,
}: Asteroid3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [currentPos, setCurrentPos] = useState(new THREE.Vector3());

  const risk = getRiskLevel(asteroid);
  const color = getAsteroidColor(risk);
  const glow = getAsteroidGlow(risk);

  const size = Math.max(0.06, Math.min(0.2, (asteroid.estimated_diameter_max_km || 0.1) * 0.15));

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime * speed;
      groupRef.current.position.x = Math.cos(t) * orbitRadius;
      groupRef.current.position.z = Math.sin(t) * orbitRadius;
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.3;

      if (hovered || isSelected) {
        setCurrentPos(groupRef.current.position.clone());
      }
    }
    if (meshRef.current) {
      const scale = (hovered || isSelected) ? 1.4 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  const showAxes = hovered || isSelected;

  return (
    <>
      <group ref={groupRef}>
        <Sphere
          ref={meshRef}
          args={[size, 16, 16]}
          onClick={(e) => { e.stopPropagation(); onSelect?.(asteroid); }}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
        >
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered || isSelected ? 1.5 : 0.6}
            roughness={0.6}
            metalness={0.3}
          />
        </Sphere>

        <Sphere args={[size * 1.6, 16, 16]}>
          <meshBasicMaterial 
            color={glow} 
            transparent 
            opacity={hovered || isSelected ? 0.35 : 0.12} 
            side={THREE.BackSide} 
          />
        </Sphere>

        {(hovered || isSelected) && (
          <>
            {/* Axis lines for distance visualization */}
            <line position={[currentPos.x, currentPos.y, currentPos.z]}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([0, 0, 0, -currentPos.x, -currentPos.y, -currentPos.z]), 3]}
                  count={2}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#4a9eff" transparent opacity={0.6} linewidth={2} />
            </line>

            {/* Info tooltip */}
            <Html distanceFactor={8} center style={{ pointerEvents: "none" }}>
              <div className="glass rounded-lg px-4 py-3 text-xs whitespace-nowrap animate-fade-in shadow-2xl border border-primary/50">
                <p className="font-bold text-primary mb-1">{asteroid.name}</p>
                <div className="space-y-1 text-[11px]">
                  <p>📍 Distance: {(asteroid.miss_distance_km / 1e6).toFixed(2)}M km</p>
                  <p>🚀 Velocity: {asteroid.relative_velocity_kms.toFixed(2)} km/s</p>
                  <p>📏 Size: {asteroid.estimated_diameter_max_km.toFixed(2)} km</p>
                  <p className="font-mono text-muted-foreground">NASA ID: {asteroid.nasa_id}</p>
                </div>
              </div>
            </Html>
          </>
        )}
      </group>

      {/* Axes helper for visual reference */}
      {showAxes && <AxisHelper position={currentPos} asteroid={asteroid} />}
    </>
  );
}
