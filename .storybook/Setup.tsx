import * as React from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Box } from "@mui/material";
import { OrbitControls } from "../components/OrbitControl";
import { useHelper } from "@react-three/drei";

const { degToRad } = THREE.MathUtils;
export function Setup({
  children,
  cameraFov = 90,
  cameraPosition = [0, 20, 150],
  lights = true,
  axesHelper = true,
  orbitControls = true,
}) {
  const virtualCamera = React.useRef<THREE.Camera>();

  return (
    <Box bgcolor="black" height="100%">
      <Canvas
        shadows
        camera={{
          position: new THREE.Vector3(...cameraPosition),
          fov: cameraFov,
        }}
      >
        <React.Suspense fallback={null}>{children}</React.Suspense>
        {lights && <Lights />}
        {orbitControls && <OrbitControls camera={virtualCamera.current} />}
        {axesHelper && <axesHelper args={[500]} />}
      </Canvas>
    </Box>
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
  const ref = React.useRef();
  useHelper(ref, THREE.PointLightHelper);
  return ref;
}
