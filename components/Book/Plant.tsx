import * as React from "react";
import * as THREE from "three";
import { useFBX } from "@react-three/drei";
import { publicUrl } from "../../src/publicUrl";

export function Plant({ position = [0, 0, 0], scale = 0.05 }) {
  const object = useFBX(publicUrl("/models/plant.fbx"));

  object.castShadow = true;
  object.receiveShadow = true;
  object.traverse((children) => {
    if (children instanceof THREE.Mesh) {
      children.castShadow = true;
      children.receiveShadow = true;
    }
  });
  return (
    <primitive
      position={position}
      scale={scale}
      object={object}
      dispose={null}
    />
  );
}
