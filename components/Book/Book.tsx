import React from "react";
import { useTexture } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";

export type BookProps = {
  width: number;
  height: number;
  depth: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  cover?: string;
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
  backCover?: string;
};

export function Book(props: BookProps) {
  const { position, width, height, depth, cover, backCover, rotation } = props;

  const frontCoverTexture = useTexture(cover);
  const backCoverTexture = useTexture(backCover);
  return (
    <mesh
      onPointerDown={props.onPointerDown}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <boxGeometry name="book" args={[width, height, depth]} />
      <meshStandardMaterial
        roughness={0.1}
        metalness={0.3}
        attachArray="material"
        map={backCoverTexture}
      />
      <meshStandardMaterial
        roughness={0.1}
        metalness={0.3}
        attachArray="material"
        map={frontCoverTexture}
      />

      <meshStandardMaterial attachArray="material" color="white" />
      <meshStandardMaterial attachArray="material" color="white" />
      <meshStandardMaterial attachArray="material" color="white" />
      <meshStandardMaterial
        roughness={0.1}
        metalness={0.3}
        attachArray="material"
        color="#252525"
      />
    </mesh>
  );
}

const defaultProps: Partial<BookProps> = {
  position: [0, 0, 0],
  width: 3.23,
  height: 23,
  depth: 15.8,
  cover: "https://images-na.ssl-images-amazon.com/images/I/612-pygu-NL.jpg",

  backCover: "https://images-na.ssl-images-amazon.com/images/I/71Dtwko9OyL.jpg",
};

Book.defaultProps = defaultProps;
