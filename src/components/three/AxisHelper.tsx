// Tangent axis lines showing distance values on asteroid hover
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Asteroid } from "@/types/asteroid";

interface AxisHelperProps {
  position: THREE.Vector3;
  asteroid: Asteroid;
}

export function AxisHelper({ position, asteroid }: AxisHelperProps) {
  const earthPos = new THREE.Vector3(0, 0, 0);
  const distToEarth = position.distanceTo(earthPos);

  // Horizontal axis: current distance line to Earth
  const midX = position.x / 2;
  const midZ = position.z / 2;

  // Vertical axis: visual representation of closest approach
  const closestApproachKm = asteroid.miss_distance_km;
  const axisLength = 1.5;

  return (
    <group>
      {/* Horizontal line: asteroid → Earth */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([position.x, position.y, position.z, 0, 0, 0]), 3]}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#4a9eff" transparent opacity={0.6} />
      </line>

      {/* Horizontal axis label */}
      <Html position={[midX, position.y + 0.3, midZ]} center style={{ pointerEvents: "none" }}>
        <div className="glass rounded px-2 py-1 text-[10px] font-mono text-primary whitespace-nowrap">
          Dist: {((asteroid.miss_distance_km || 0) / 1e6).toFixed(2)}M km
        </div>
      </Html>

      {/* Vertical line: closest approach axis */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([position.x, position.y - axisLength / 2, position.z, position.x, position.y + axisLength / 2, position.z]), 3]}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#f59e0b" transparent opacity={0.5} />
      </line>

      {/* Vertical axis label */}
      <Html position={[position.x + 0.15, position.y + axisLength / 2 + 0.15, position.z]} center style={{ pointerEvents: "none" }}>
        <div className="glass rounded px-2 py-1 text-[10px] font-mono text-warning whitespace-nowrap">
          Min: {(asteroid.miss_distance_lunar || 0).toFixed(1)} LD
        </div>
      </Html>
    </group>
  );
}
