import * as React from "react";
import * as THREE from "three";
import { Flex, Box } from "@react-three/flex/dist/index.cjs";
import { useTexture } from "@react-three/drei";

function Surface({ width, height, depth }) {
  const texture = useTexture(
    "/deva/textures/wood/Wood_Plywood_Front_001_basecolor.jpg"
  );
  const roughness = useTexture(
    "/deva/textures/wood/Wood_Plywood_Front_001_roughness.jpg"
  );
  const normal = useTexture(
    "/deva/textures/wood/Wood_Plywood_Front_001_normal.jpg"
  );
  const aoTexture = useTexture(
    "/deva/textures/wood/Wood_Plywood_Front_001_ambientOcclusion.jpg"
  );

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  const repeat = 1;
  texture.repeat.set(repeat, repeat);

  return (
    <mesh receiveShadow castShadow>
      <boxGeometry name="surface" args={[width, height, depth]} />
      <meshStandardMaterial
        roughnessMap={roughness}
        aoMap={aoTexture}
        normalMap={normal}
        map={texture}
        color="#443a2c"
        attach="material"
      />
    </mesh>
  );
}

export function Shelf({
  children,
  position = [0, 0, 0],
  width = 50,
  height = 2,
  depth = 30,
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
