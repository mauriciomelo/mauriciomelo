import * as React from "react";
import { Plane, useNormalTexture } from "@react-three/drei";

export function Wall() {
  const repeat = 20;
  const [normalMap] = useNormalTexture(63, {
    offset: [0, 0],
    repeat: [repeat, repeat],
    anisotropy: 8,
  });

  const width = 1000;
  const height = 600;
  return (
    // @ts-ignore
    <Plane args={[width, height]} position={[0, height / 4, 0]} receiveShadow>
      <meshStandardMaterial
        color="#202020"
        roughness={0.6}
        metalness={0.3}
        normalMap={normalMap}
      />
    </Plane>
  );
}
