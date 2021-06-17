import * as React from "react";
import * as THREE from "three";
import { Book, BookProps } from "./Book";
import { Setup } from "../../.storybook/Setup";
import {
  Plane,
  useHelper,
  useNormalTexture,
  useTexture,
} from "@react-three/drei";
import { OrbitControls } from "../OrbitControl";
import { Flex, Box } from "@react-three/flex/dist/index.cjs";
import { Shelf } from "./Shelf";
import { myBooks } from "./myBooks";

export default {
  title: "Book",
  component: Setup,
};

const { degToRad } = THREE.Math;

const volume = (x) => x.width * x.height * x.depth;
const byVolume = (a, b) => volume(b) - volume(a);
const byHeight = (a, b) => b.height - a.height;
const byPageCount = (a, b) => b.pages - a.pages;

const book1: BookProps = {
  position: [0, 4.4, 0],
  width: 3.23,
  height: 23,
  depth: 15.8,
  cover: "https://images-na.ssl-images-amazon.com/images/I/612-pygu-NL.jpg",

  backCover: "https://images-na.ssl-images-amazon.com/images/I/71Dtwko9OyL.jpg",
};

export function Main(args: BookProps) {
  return (
    <Setup>
      <Book {...args} />
    </Setup>
  );
}

Main.args = book1;

function useLight() {
  const ref = React.useRef();
  useHelper(ref, THREE.PointLightHelper);
  return ref;
}

function StoryControls({ children }) {
  const topLightRef = useLight();
  const keyLightRef = useLight();
  const leftLightRef = useLight();

  return (
    <>
      {children}
      <OrbitControls autoRotate={false} />

      <pointLight
        ref={topLightRef}
        intensity={1}
        decay={2}
        color="#ffce8e"
        position={[0, 150, 20]}
        castShadow
      />

      <pointLight
        ref={leftLightRef}
        intensity={1}
        decay={2}
        color="#ffce8e"
        position={[-100, 150, 20]}
        castShadow
      />

      <pointLight
        ref={keyLightRef}
        intensity={1}
        decay={2}
        position={[50, 150, 200]}
        castShadow
      />

      <hemisphereLight args={[0xffeeb1, 0x080820, 1]} />
    </>
  );
}
export function ShelfItem({ cover, coverRotation, ...rest }) {
  return (
    <Setup lights={false} orbitControls={false} axesHelper={true}>
      <StoryControls {...rest}>
        <Shelf cover={cover} coverRotation={coverRotation}>
          {myBooks.sort(byVolume).map((book, index) => (
            <Book key={index} {...book} />
          ))}
        </Shelf>
      </StoryControls>
    </Setup>
  );
}
ShelfItem.args = {
  cover: true,
  coverRotation: 60,
};

ShelfItem.argTypes = {
  coverRotation: {
    control: {
      type: "range",
      min: 0,
      max: 180,
    },
  },
};

export function ShelfList() {
  return (
    <Setup lights={false} orbitControls={false} axesHelper={true}>
      <StoryControls>
        <Flex>
          <Box>
            <Shelf cover={false} coverRotation={0}>
              {myBooks.sort(byVolume).map((book, index) => (
                <Book key={index} {...book} />
              ))}
            </Shelf>
          </Box>

          <Box marginTop={5}>
            <Shelf cover={true} coverRotation={90}>
              {myBooks.sort(byVolume).map((book, index) => (
                <Book key={index} {...book} />
              ))}
            </Shelf>
          </Box>

          <Box marginTop={5}>
            <Shelf coverRotation={60} cover={true}>
              {myBooks.sort(byVolume).map((book, index) => (
                <Book key={index} {...book} />
              ))}
            </Shelf>
          </Box>
        </Flex>
      </StoryControls>
    </Setup>
  );
}

export function Room() {
  return (
    <Setup lights={false} orbitControls={false} axesHelper={false}>
      <StoryControls>
        <Wall />
        <Floor />

        <Flex position={[-100, 60, 15]}>
          <Box>
            <Shelf cover={false} coverRotation={0}>
              {myBooks.sort(byVolume).map((book, index) => (
                <Book key={index} {...book} />
              ))}
            </Shelf>
          </Box>

          <Box marginTop={5}>
            <Shelf cover={true} coverRotation={90}>
              {myBooks.sort(byVolume).map((book, index) => (
                <Book key={index} {...book} />
              ))}
            </Shelf>
          </Box>

          <Box marginTop={5}>
            <Shelf coverRotation={60} cover={true}>
              {myBooks.sort(byVolume).map((book, index) => (
                <Book key={index} {...book} />
              ))}
            </Shelf>
          </Box>
        </Flex>
      </StoryControls>
    </Setup>
  );
}
function Floor() {
  const texture = useTexture(
    "/deva/textures/floor/Wood_Floor_009_basecolor.jpg"
  );
  const roughness = useTexture(
    "/deva/textures/floor/Wood_Floor_009_roughness.jpg"
  );
  const aoTexture = useTexture(
    "/deva/textures/floor/Wood_Floor_009_ambientOcclusion.jpg"
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

function Wall() {
  const repeat = 20;
  const [normalMap] = useNormalTexture(
    63, // index of the normal texture - https://github.com/emmelleppi/normal-maps/blob/master/normals.json
    {
      offset: [0, 0],
      repeat: [repeat, repeat],
      anisotropy: 8,
    }
  );

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
