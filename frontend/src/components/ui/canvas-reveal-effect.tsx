import React, { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/utils";

type UniformValue = number | number[] | number[][];
type UniformDefinition = { value: UniformValue; type: string };
type Uniforms = Record<string, UniformDefinition>;

export const CanvasRevealEffect = ({
  animationSpeed = 0.4,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize = 3,
  showGradient = true,
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
}) => (
  <div className={cn("relative h-full w-full", containerClassName)}>
    <Canvas className="!absolute inset-0 h-full w-full" dpr={[1, 1.5]}>
      <DotMatrix
        colors={colors}
        dotSize={dotSize}
        opacities={opacities}
        animationSpeed={animationSpeed}
      />
    </Canvas>
    {showGradient ? <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent" /> : null}
  </div>
);

function DotMatrix({
  colors,
  opacities,
  dotSize,
  animationSpeed,
}: {
  colors: number[][];
  opacities: number[];
  dotSize: number;
  animationSpeed: number;
}) {
  const { size } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const lastFrameTime = useRef(0);

  const shaderColors = useMemo(() => {
    const source = colors.length ? colors : [[139, 92, 246]];
    const expanded = source.length === 1
      ? Array(6).fill(source[0])
      : source.length === 2
        ? [source[0], source[0], source[0], source[1], source[1], source[1]]
        : [source[0], source[0], source[1], source[1], source[2] ?? source[1], source[2] ?? source[1]];
    return expanded.map((entry) => entry.map((channel: number) => channel / 255));
  }, [colors]);

  const safeOpacities = useMemo(() => {
    const values = opacities.slice(0, 10);
    while (values.length < 10) values.push(values.at(-1) ?? 0.3);
    return values;
  }, [opacities]);

  const material = useMemo(() => new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    transparent: true,
    depthWrite: false,
    uniforms: {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(size.width * 2, size.height * 2) },
      u_colors: { value: shaderColors.map((color) => new THREE.Vector3(...(color as [number, number, number]))) },
      u_opacities: { value: safeOpacities },
      u_dot_size: { value: dotSize },
      u_total_size: { value: 4 },
      u_animation_speed: { value: animationSpeed },
    },
    vertexShader: `
      precision mediump float;
      out vec2 fragCoord;
      uniform vec2 u_resolution;
      void main() {
        gl_Position = vec4(position.xy, 0.0, 1.0);
        fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
        fragCoord.y = u_resolution.y - fragCoord.y;
      }
    `,
    fragmentShader: `
      precision mediump float;
      in vec2 fragCoord;
      uniform float u_time;
      uniform float u_opacities[10];
      uniform vec3 u_colors[6];
      uniform float u_dot_size;
      uniform float u_total_size;
      uniform float u_animation_speed;
      uniform vec2 u_resolution;
      out vec4 fragColor;
      float PHI = 1.6180339887498948482;
      float random(vec2 xy) {
        return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
      }
      void main() {
        vec2 st = fragCoord;
        st -= floor(mod(u_resolution - vec2(u_dot_size), u_total_size) * 0.5);
        vec2 cell = floor(st / u_total_size);
        float opacity = step(0.0, st.x) * step(0.0, st.y);
        float seed = random(cell);
        float rand = random(cell * floor((u_time * u_animation_speed / 5.0) + seed + 5.0) + 1.0);
        opacity *= u_opacities[int(clamp(floor(rand * 10.0), 0.0, 9.0))];
        opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
        opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));
        vec3 color = u_colors[int(floor(seed * 6.0))];
        float intro = distance(cell, u_resolution / (2.0 * u_total_size)) * 0.012 + seed * 0.12;
        opacity *= smoothstep(intro, intro + 0.12, u_time * u_animation_speed);
        fragColor = vec4(color, opacity);
      }
    `,
  }), [animationSpeed, dotSize, safeOpacities, shaderColors, size.height, size.width]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const now = clock.getElapsedTime();
    if (now - lastFrameTime.current < 1 / 30) return;
    lastFrameTime.current = now;
    (meshRef.current.material as THREE.ShaderMaterial).uniforms.u_time.value = now;
  });

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}
