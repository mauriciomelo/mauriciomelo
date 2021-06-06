import * as React from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Box } from "@material-ui/core";
import { OrbitControls } from "@react-three/drei";

export function Setup({
  children,
  cameraFov = 75,
  cameraPosition = new THREE.Vector3(-5, 5, 5),
}) {
  const virtualCamera = React.useRef<THREE.Camera>();

  return (
    <Box height="100%">
      <Canvas shadows camera={{ position: cameraPosition, fov: cameraFov }}>
        <React.Suspense fallback={null}>{children}</React.Suspense>
        <ambientLight intensity={0.8} />
        <pointLight intensity={1} position={[0, 6, 0]} />
        <OrbitControls camera={virtualCamera.current} autoRotate />
      </Canvas>
    </Box>
  );
}
