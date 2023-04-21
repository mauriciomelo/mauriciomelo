import * as React from "react";
import * as THREE from "three";
import { Plane, useTexture } from "@react-three/drei";
import { publicUrl } from "../../src/publicUrl";
const { degToRad } = THREE.MathUtils;

export function Floor() {
  const texture = useTexture(
    publicUrl("/textures/floor/Wood_Floor_009_basecolor.jpg")
  );
  const roughness = useTexture(
    publicUrl("/textures/floor/Wood_Floor_009_roughness.jpg")
  );
  const aoTexture = useTexture(
    publicUrl("/textures/floor/Wood_Floor_009_ambientOcclusion.jpg")
  );

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  const repeat = 8;
  texture.repeat.set(repeat, repeat);

  const width = 1000;
  const height = 600;
  return (
    // @ts-ignore
    <Plane
      args={[width, height]}
      rotation={[degToRad(-90), 0, 0]}
      position={[0, -100, height / 2]}
      receiveShadow
    >
      <meshStandardMaterial
        roughnessMap={roughness}
        aoMap={aoTexture}
        map={texture}
      />
    </Plane>
  );
}
