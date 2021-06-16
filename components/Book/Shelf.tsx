import * as React from "react";
import * as THREE from "three";
import { Flex, Box } from "@react-three/flex/dist/index.cjs";

function Surface({ width, height, depth }) {
  return (
    <mesh receiveShadow castShadow>
      <boxGeometry name="surface" args={[width, height, depth]} />
      <meshStandardMaterial
        roughness={0.7}
        metalness={0}
        attach="material"
        color="#3e0000"
      />
    </mesh>
  );
}

export function Shelf({
  children,
  position = [0, 0, 0],
  width = 50,
  height = 2,
  depth = 15,
  cover = true,
  coverRotation = 90,
}) {
  const books = React.Children.toArray(
    children
  ) as React.DetailedReactHTMLElement<any, HTMLElement>[];
  const spaceBetween = cover ? 2 : 0;

  const rotation = cover ? coverRotation : 180;
  const distanceProp = cover ? "depth" : "width";

  const surfaceWidth =
    books.reduce((acc, book) => acc + book.props[distanceProp], 0) +
    (books.length - 1) * spaceBetween;

  return (
    <Flex
      size={[surfaceWidth, 0, 0]}
      alignItems="stretch"
      justifyContent="flex-end"
      position={position}
    >
      <Box flexDirection="row" alignItems="flex-end">
        {books.map((child, index) => (
          <Box
            centerAnchor
            marginRight={spaceBetween}
            rotation={[0, THREE.Math.degToRad(rotation), 0]}
            key={index}
          >
            {child}
          </Box>
        ))}
      </Box>
      <Box width="auto" centerAnchor>
        {(width) => <Surface width={width} height={height} depth={depth} />}
      </Box>
    </Flex>
  );
}
