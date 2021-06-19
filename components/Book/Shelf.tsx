import * as React from "react";
import * as THREE from "three";
import { Flex, Box } from "@react-three/flex/dist/index.cjs";
import { useTexture } from "@react-three/drei";
import { publicUrl } from "../../src/publicUrl";

function Surface({ width, height, depth }) {
  const texture = useTexture(
    publicUrl("/textures/wood/Wood_Plywood_Front_001_basecolor.jpg")
  );
  const roughness = useTexture(
    publicUrl("/textures/wood/Wood_Plywood_Front_001_roughness.jpg")
  );
  const normal = useTexture(
    publicUrl("/textures/wood/Wood_Plywood_Front_001_normal.jpg")
  );
  const aoTexture = useTexture(
    publicUrl("/textures/wood/Wood_Plywood_Front_001_ambientOcclusion.jpg")
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
  const surfaceWidth = 200;
  const rowHeight = 30;

  const getBookWidth = (book) =>
    spaceBetween + (cover ? book.props.depth : book.props.width);

  const numberOfShelves = numberOfRows(books, getBookWidth, surfaceWidth);

  return (
    <>
      <Flex
        size={[surfaceWidth, 300, 0]}
        alignItems="flex-start"
        justifyContent="flex-start"
        position={[position[0], position[1], position[2] + 3]}
        flexDirection="row"
        flexWrap="wrap"
      >
        {books.map((child, index) => (
          <Box
            flexWrap="no-wrap"
            centerAnchor
            height={rowHeight}
            marginRight={spaceBetween}
            alignItems="flex-end"
            justifyContent="flex-end"
            rotation={[0, THREE.Math.degToRad(rotation), 0]}
            key={index}
          >
            <Box centerAnchor>{child}</Box>
          </Box>
        ))}
      </Flex>

      <Flex
        size={[surfaceWidth, 0, 0]}
        position={[position[0], position[1] - 31, position[2]]}
        flexDirection="column"
      >
        {Array(numberOfShelves)
          .fill(null)
          .map((_, key) => (
            <Box key={key} centerAnchor marginTop={0} height={rowHeight}>
              <Surface width={surfaceWidth} height={height} depth={depth} />
            </Box>
          ))}
      </Flex>
    </>
  );
}
function numberOfRows<T>(
  books: T[],
  getBookWidth: (T) => number,
  surfaceWidth: number
) {
  let currentRowWidth = 0;
  let rowsCount = 0;

  for (let index = 0; index < books.length; index++) {
    const bookWidth = getBookWidth(books[index]);
    const fitInRow = surfaceWidth > currentRowWidth + bookWidth;

    if (fitInRow) {
      currentRowWidth += bookWidth;
    } else {
      rowsCount += 1;
      currentRowWidth = bookWidth;
    }
  }

  const numberOfShelves = rowsCount + (currentRowWidth > 0 ? 1 : 0);
  return numberOfShelves;
}
