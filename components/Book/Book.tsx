import React from "react";
import { useTexture } from "@react-three/drei";

export type BookProps = {
  width: number;
  height: number;
  depth: number;
  position: [number, number, number];
  frontCoverUrl?: string;
  backCoverUrl?: string;
};

export function Book(props: BookProps) {
  const { position, width, height, depth, frontCoverUrl, backCoverUrl } = props;

  const frontCoverTexture = useTexture(frontCoverUrl);
  const backCoverTexture = useTexture(backCoverUrl);

  return (
    <mesh position={position} scale={0.3}>
      <boxGeometry args={[width, height, depth]} />
      <meshBasicMaterial
        attachArray="material"
        map={frontCoverTexture}
        roughness={0.3}
        metalness={0.9}
      />
      <meshBasicMaterial attachArray="material" map={backCoverTexture} />

      <meshStandardMaterial attachArray="material" color="white" />
      <meshStandardMaterial attachArray="material" color="white" />
      <meshStandardMaterial attachArray="material" color="#912f0c" />
      <meshStandardMaterial attachArray="material" color="white" />
    </mesh>
  );
}

const defaultProps: Partial<BookProps> = {
  position: [0, 0, 0],
  width: 3.23,
  height: 23,
  depth: 15.8,
  frontCoverUrl:
    "https://images-na.ssl-images-amazon.com/images/I/612-pygu-NL.jpg",

  backCoverUrl:
    "https://images-na.ssl-images-amazon.com/images/I/71Dtwko9OyL.jpg",
};

Book.defaultProps = defaultProps;
