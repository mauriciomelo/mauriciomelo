import * as React from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Box } from "@material-ui/core";
import { OrbitControls } from "../components/OrbitControl";
import { useHelper } from "@react-three/drei";

const { degToRad } = THREE.Math;
export function Setup({
  children,
  cameraFov = 90,
  cameraPosition = new THREE.Vector3(0, 20, 150),
  lights = true,
  axesHelper = true,
  orbitControls = true,
}) {
  const virtualCamera = React.useRef<THREE.Camera>();
  // const keyLightRef = useLight();

  return (
    <Box bgcolor="black" height="100%">
      <Canvas
        shadows
        camera={{
          position: cameraPosition,
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
