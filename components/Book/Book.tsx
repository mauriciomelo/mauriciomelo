import React from "react";
import { useNormalTexture, useTexture } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { publicUrl } from "../../src/publicUrl";

export type BookProps = {
  width: number;
  height: number;
  depth: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  cover?: string;
  spine?: string;
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
  backCover?: string;
  leather?: boolean;
};

export enum Rotation {
  Cover = Math.PI / 2,
}
export function Book(props: BookProps) {
  const defaultTexture = "";
  const {
    position,
    width,
    height,
    depth,
    cover = defaultTexture,
    backCover = defaultTexture,
    spine = defaultTexture,
    rotation,
    leather,
  } = props;

  const frontCoverTexture = useTexture(cover);
  const backCoverTexture = useTexture(backCover);
  const spineTexture = useTexture(spine);

  const normalMap = useTexture(
    publicUrl("/textures/leather-texture-normal.png")
  );

  const leatherMaterial = {
    roughness: 0.7,
    metalness: 0,
    attachArray: "material",
    normalMap,
  };

  const paperMaterial = {
    roughness: 0.1,
    metalness: 0.3,
    attachArray: "material",
  };

  const baseMaterial = leather ? leatherMaterial : paperMaterial;

  const materials = [
    { map: backCoverTexture, ...baseMaterial },
    { map: frontCoverTexture, ...baseMaterial },
    { color: "white" },
    { color: "white" },
    { color: "white" },
    { map: spineTexture, ...baseMaterial },
  ];

  return (
    <mesh
      onPointerDown={props.onPointerDown}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <boxGeometry name="book" args={[width, height, depth]} />

      {materials.map((material, index) => (
        <meshStandardMaterial
          {...material}
          key={index}
          attach={`material-${index}`}
        />
      ))}
    </mesh>
  );
}

const leatherCover = publicUrl("/textures/black-leather-texture.jpeg");

const defaultProps: Partial<BookProps> = {
  position: [0, 0, 0],
  rotation: [0, Rotation.Cover, 0],
  width: 3.23,
  height: 23,
  depth: 15.8,
  cover: leatherCover,
  spine: leatherCover,
  backCover: leatherCover,
};

Book.defaultProps = defaultProps;
