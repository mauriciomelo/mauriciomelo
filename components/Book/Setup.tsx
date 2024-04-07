import * as React from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "../OrbitControl";
import { useHelper } from "@react-three/drei";

type SetupProps = React.PropsWithChildren<{
  cameraFov?: 90;
  cameraPosition?: [number, number, number];
  lights?: boolean;
  axesHelper?: boolean;
  orbitControls?: boolean;
}>;
export function Setup({
  children,
  cameraFov = 90,
  cameraPosition = [0, 20, 150],
  lights = true,
  axesHelper = true,
  orbitControls = true,
}: SetupProps) {
  return (
    <div className="h-[700px] bg-gradient-to-r from-gray-50 to-gray-100">
      <Canvas
        shadows
        camera={{
          position: new THREE.Vector3(...cameraPosition),
          fov: cameraFov,
        }}
      >
        <React.Suspense fallback={null}>{children}</React.Suspense>
        {lights && <Lights />}
        {orbitControls && <OrbitControls />}
        {axesHelper && <axesHelper args={[500]} />}
      </Canvas>
    </div>
  );
}

function Lights() {
  const keyLightRef = useLight();
  const sideLightRef = useLight();

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight ref={keyLightRef} intensity={1} position={[-10, 6, 40]} />
      <pointLight ref={sideLightRef} intensity={1} position={[-30, 6, 10]} />
    </>
  );
}

export function useLight() {
  const ref = React.useRef<THREE.PointLight>(null);
  useHelper(ref as any, THREE.PointLightHelper);
  return ref;
}
