import * as React from "react";
import * as THREE from "three";
import produce from "immer";
import { Book, BookProps } from "./Book";
import { Setup } from "../../.storybook/Setup";
import { useHelper } from "@react-three/drei";
import { OrbitControls } from "../OrbitControl";
import { Flex, Box as FlexBox } from "@react-three/flex/dist/index.cjs";
import { Shelf } from "./Shelf";
import { myBooks, parseDimentions } from "./myBooks";
import { Wall } from "./Wall";
import { Floor } from "./Floor";
import { Plant } from "./Plant";
import { EditBook } from "./EditBook";
import { Box } from "@material-ui/core";
import { Book as EditBookProps } from "./getBooks";

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
      max: 360,
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
  const [books, setBooks] = React.useState(buildBooks(booksNumber));
  const [bookToEdit, editBook] = React.useState<EditBookProps | null>(null);

  const handleEdit = React.useCallback(
    (book: EditBookProps) => {
      const nextState = produce(books, (draft) => {
        const index = books.findIndex((b) => b.isbn === book.isbn);
        draft[index] = { ...book, ...parseDimentions(book.dimentions) };
      });
      setBooks(nextState);
    },
    [books]
  );

  const handleEditClose = React.useCallback(() => {
    editBook(null);
  }, []);

  const handleSelectBook = React.useCallback(
    (book: EditBookProps) => () => {
      editBook(book);
    },
    []
  );

  return (
    <>
      <Box
        bgcolor="rgba(0,0,0, .5)"
        position="absolute"
        borderRadius={7}
        zIndex="100"
        right={20}
        m={4}
        style={{ backdropFilter: "blur(15px)" }}
      >
        {bookToEdit && (
          <EditBook
            key={bookToEdit.isbn}
            book={bookToEdit}
            onChange={handleEdit}
            onClose={handleEditClose}
          />
        )}
      </Box>

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
            <FlexBox marginTop={5}>
              <Shelf coverRotation={coverRotation}>
                {books.map((book, index) => (
                  <Book
                    onClick={handleSelectBook(book)}
                    key={index}
                    {...book}
                  />
                ))}
              </Shelf>
            </FlexBox>
          </Flex>
        </StoryControls>
      </Setup>
    </>
  );
}

Room.args = { ...defaultStoryArgs, autoRotate: false, coverRotation: 43 };
Room.defaultProps = Room.args;
Room.argTypes = defaultStoryArgTypes;
