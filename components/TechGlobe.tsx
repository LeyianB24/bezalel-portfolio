"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  OrbitControls, 
  Sphere, 
  MeshDistortMaterial, 
  Float, 
  PerspectiveCamera, 
  Text,
  useCursor
} from "@react-three/drei";
import * as THREE from "three";
import { 
  SiJavascript, 
  SiTypescript, 
  SiReact, 
  SiNextdotjs, 
  SiTailwindcss, 
  SiPython, 
  SiGnubash, 
  SiDocker, 
  SiPostgresql,
  SiFramer
} from "react-icons/si";
import { motion } from "framer-motion";

const TECH_STACK = [
  { name: "React", color: "#61DAFB" },
  { name: "Next.js", color: "#ffffff" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "Three.js", color: "#ffffff" },
  { name: "Tailwind", color: "#38B2AC" },
  { name: "Python", color: "#3776AB" },
  { name: "Node.js", color: "#339933" },
  { name: "Postgres", color: "#4169E1" },
  { name: "Framer", color: "#BB00FF" },
  { name: "Docker", color: "#2496ED" },
];

function OrbitingIcon({ name, color, index, total }: { name: string, color: string, index: number, total: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = React.useState(false);
  
  useCursor(hovered);

  const radius = 4;
  const phi = Math.acos(-1 + (2 * index) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;

  const position = useMemo(() => {
    return new THREE.Vector3().setFromSphericalCoords(radius, phi, theta);
  }, [phi, theta]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Slow orbit
    const orbitSpeed = 0.2;
    meshRef.current.position.x = position.x * Math.cos(time * orbitSpeed) - position.z * Math.sin(time * orbitSpeed);
    meshRef.current.position.z = position.x * Math.sin(time * orbitSpeed) + position.z * Math.cos(time * orbitSpeed);
    meshRef.current.position.y = position.y + Math.sin(time + index) * 0.2;
    
    // Face camera
    meshRef.current.lookAt(state.camera.position);
  });

  return (
    <group ref={meshRef}>
      <Text
        fontSize={0.4}
        color={hovered ? "#28C840" : color}
        anchorX="center"
        anchorY="middle"
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {name}
      </Text>
      
      {/* Subtle glow behind text */}
      {hovered && (
        <Sphere args={[0.3, 16, 16]}>
          <meshBasicMaterial color="#28C840" transparent opacity={0.2} />
        </Sphere>
      )}
    </group>
  );
}

function Globe() {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!sphereRef.current) return;
    sphereRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
  });

  return (
    <group>
      {/* Central Core */}
      <Sphere ref={sphereRef} args={[2.5, 64, 64]}>
        <MeshDistortMaterial
          color="#1e1e1e"
          roughness={0.1}
          metalness={1}
          distort={0.4}
          speed={2}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Orbiting Tech Labels */}
      {TECH_STACK.map((tech, i) => (
        <OrbitingIcon 
          key={tech.name} 
          name={tech.name} 
          color={tech.color} 
          index={i} 
          total={TECH_STACK.length} 
        />
      ))}

      {/* Atmospheric Glow */}
      <Sphere args={[2.7, 64, 64]}>
        <meshStandardMaterial 
          color="#28C840" 
          transparent 
          opacity={0.05} 
          wireframe
          side={THREE.DoubleSide}
        />
      </Sphere>
    </group>
  );
}

export default function TechGlobe() {
  return (
    <div className="w-full h-[500px] relative">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#28C840" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FF5F57" />
        
        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Globe />
          </Float>
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Gradient Mask to blend with page */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_80%)]" />
    </div>
  );
}
