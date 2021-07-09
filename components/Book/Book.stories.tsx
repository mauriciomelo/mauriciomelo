import * as React from "react";
import * as THREE from "three";
import produce from "immer";
import { useSpring, a } from "@react-spring/three";
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
import { useFrame } from "@react-three/fiber";

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

export function RoomSt({
  showAxes,
  coverRotation,
  booksNumber,
  ...rest
}: typeof defaultStoryArgs) {
  const [books, setBooks] = React.useState(buildBooks(booksNumber));
  const [editBook, setEditBook] = React.useState<
    (EditBookProps & { position?: number[] }) | null
  >(null);

  const handleEdit = React.useCallback(
    (book: EditBookProps) => {
      setEditBook({ ...book, ...parseDimentions(book.dimentions) });
    },
    [editBook]
  );

  const handleEditClose = React.useCallback(() => {
    const nextState = produce(books, (draft) => {
      const index = books.findIndex((b) => b.isbn === editBook.isbn);
      editBook.position = undefined;
      draft[index] = editBook;
    });
    setBooks(nextState);
    setEditBook(null);
  }, [editBook, books]);

  const handleSelectBook = React.useCallback(
    (book: EditBookProps, event?: any) => {
      setEditBook({
        ...book,
        position: [
          event?.point.x || 0,
          event?.point.y || 0,
          event?.point.z || 0,
        ],
      });
    },
    []
  );

  React.useEffect(() => {
    handleSelectBook(books[0]);
  }, []);

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
        {editBook && (
          <EditBook
            key={editBook.isbn}
            book={editBook}
            onChange={handleEdit}
            onClose={handleEditClose}
          />
        )}
      </Box>

      <Setup lights={false} orbitControls={false} axesHelper={showAxes}>
        <StoryControls {...rest}>
          <Room
            books={books}
            editBook={editBook}
            onSelect={handleSelectBook}
            coverRotation={coverRotation}
          />
        </StoryControls>
      </Setup>
    </>
  );
}

RoomSt.args = { ...defaultStoryArgs, autoRotate: false, coverRotation: 43 };
RoomSt.defaultProps = RoomSt.args;
RoomSt.argTypes = defaultStoryArgTypes;
RoomSt.storyName = "Room";

interface RoomProps {
  editBook: EditBookProps;
  books: EditBookProps[];
  onSelect: (book: EditBookProps, e: any) => void;
  coverRotation: number;
}

function Room({ books, editBook, onSelect, coverRotation }: RoomProps) {
  const step = 0.1;
  const zoom = Boolean(editBook);

  useFrame((state) => {
    if (zoom) {
      state.camera.position.lerp(new THREE.Vector3(15, 1, 100), step);
    }
    state.camera.lookAt(0, 0, 0);
    state.camera.updateProjectionMatrix();
  });

  return (
    <>
      <Wall />
      <Floor />
      <Plant position={[120, -100, 20]} scale={0.07} />
      {editBook && <BookEditMode key={editBook.isbn} {...editBook} />}

      <Flex
        alignItems="flex-start"
        justifyContent="flex-end"
        position={[-100, 0, 15]}
      >
        <FlexBox marginTop={5}>
          <Shelf coverRotation={coverRotation}>
            {books.map((book, index) => (
              <Book
                onPointerDown={(e) => onSelect(book, e)}
                key={index}
                {...book}
              />
            ))}
          </Shelf>
        </FlexBox>
      </Flex>
    </>
  );
}

function BookEditMode(props) {
  const { position, ...rest } = props;
  const animationProps = useSpring({
    to: {
      position: [0, 0, 80],
      rotation: [0, THREE.Math.degToRad(95), 0],
    },
    from: {
      position: position,
      rotation: [THREE.Math.degToRad(95), 0, 0],
    },
    reset: false,
  });

  return (
    <a.mesh {...animationProps}>
      <Book {...rest} />
    </a.mesh>
  );
}
