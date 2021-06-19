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
import { Plant } from "./Plant";

export default {
  title: "Book",
  component: Setup,
};

const buildBooks = (n) =>
  Array(Math.ceil(n / myBooks.length) || 1)
    .fill(myBooks)
    .flat()
    .slice(0, n);

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

export function BookSt(args: BookProps) {
  return (
    <Setup>
      <Book {...args} />
    </Setup>
  );
}

BookSt.args = book1;
BookSt.storyName = "Book";
function useLight() {
  const ref = React.useRef();
  useHelper(ref, THREE.PointLightHelper);
  return ref;
}

function StoryControls({ autoRotate, children }) {
  const topLightRef = useLight();
  const keyLightRef = useLight();
  const leftLightRef = useLight();

  return (
    <>
      {children}
      <OrbitControls autoRotate={autoRotate} />

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

const defaultStoryArgs = {
  coverRotation: 60,
  booksNumber: 31,
  autoRotate: true,
  showAxes: false,
} as const;

const defaultStoryArgTypes = {
  coverRotation: {
    control: {
      type: "range",
      min: 0,
      max: 180,
    },
  },

  booksNumber: {
    control: {
      type: "range",
      min: 0,
      max: 600,
    },
  },
};
export function ShelfSt({
  booksNumber,
  coverRotation,
  showAxes,
  ...rest
}: typeof defaultStoryArgs) {
  return (
    <Setup lights={false} orbitControls={false} axesHelper={showAxes}>
      <StoryControls {...rest}>
        <Shelf position={[-100, 100, 15]} coverRotation={coverRotation}>
          {buildBooks(booksNumber).map((book, index) => (
            <Book key={index} {...book} />
          ))}
        </Shelf>
      </StoryControls>
    </Setup>
  );
}

ShelfSt.storyName = "Shelf";

ShelfSt.args = defaultStoryArgs;
ShelfSt.defaultProps = ShelfSt.args;

ShelfSt.argTypes = defaultStoryArgTypes;

export function Room({
  showAxes,
  coverRotation,
  booksNumber,
  ...rest
}: typeof defaultStoryArgs) {
  return (
    <Setup lights={false} orbitControls={false} axesHelper={showAxes}>
      <StoryControls {...rest}>
        <Wall />
        <Floor />
        <Plant position={[120, -100, 20]} scale={0.07} />

        <Flex
          alignItems="flex-start"
          justifyContent="flex-end"
          position={[-100, 0, 15]}
        >
          <Box marginTop={5}>
            <Shelf coverRotation={coverRotation}>
              {buildBooks(booksNumber).map((book, index) => (
                <Book key={index} {...book} />
              ))}
            </Shelf>
          </Box>
        </Flex>
      </StoryControls>
    </Setup>
  );
}

Room.args = { ...defaultStoryArgs, autoRotate: false, coverRotation: 43 };
Room.defaultProps = Room.args;
Room.argTypes = defaultStoryArgTypes;
