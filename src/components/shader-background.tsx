"use client";

import { Canvas } from "@react-three/fiber";
import { ShaderPlane } from "@/components/ui/background-paper-shaders";

export function ShaderBackground() {
  return (
    <div className="absolute inset-0 opacity-40 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ShaderPlane position={[-1.2, 0.5, 0]} color1="#1a2600" color2="#d4ff2b" />


        <ambientLight intensity={0.3} />
      </Canvas>
    </div>
  );
}
