import * as React from "react";
import * as THREE from "three";
import { Book, BookProps } from "./Book";
import { Setup } from "../../.storybook/Setup";
import { useHelper } from "@react-three/drei";
import { OrbitControls } from "../OrbitControl";
import { Flex, Box } from "@react-three/flex/dist/index.cjs";
import { Shelf } from "./Shelf";
import { myBooks } from "./myBooks";
import { Wall } from "./Wall";
import { Floor } from "./Floor";

export default {
  title: "Book",
  component: Setup,
};

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
        position={[-20, 150, 130]}
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
              {myBooks.sort(byHeight).map((book, index) => (
                <Book key={index} {...book} />
              ))}
            </Shelf>
          </Box>

          <Box marginTop={5}>
            <Shelf coverRotation={60} cover={true}>
              {myBooks.sort(byPageCount).map((book, index) => (
                <Book key={index} {...book} />
              ))}
            </Shelf>
          </Box>
        </Flex>
      </StoryControls>
    </Setup>
  );
}
