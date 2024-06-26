import * as React from "react";
import * as THREE from "three";
import produce from "immer";
import { useSpring, a } from "@react-spring/three";
import { Book, BookProps, Rotation } from "./Book";
import { Setup, useLight } from "./Setup";
import { OrbitControls } from "../OrbitControl";
import { Flex, Box as FlexBox } from "@react-three/flex";
import { Shelf } from "./Shelf";
import { myBooks } from "./myBooks";
import { Wall } from "./Wall";
import { Floor } from "./Floor";
import { Plant } from "./Plant";
import { EditBook } from "./EditBook";
import { Box } from "@mui/material";
import { Book as EditBookProps } from "./getBooks";
import { useFrame } from "@react-three/fiber";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Setup> = {
  title: "3D/BookShelf/Book",
  component: Setup,
};

export default meta;

type Story = StoryObj<typeof Setup>;

const buildBooks = (n: number) =>
  Array(Math.ceil(n / myBooks.length) || 1)
    .fill(myBooks)
    .flat()
    .slice(0, n);

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
    <Setup cameraPosition={[10.29, 10.04, 23.06]}>
      <Book {...args} />
    </Setup>
  );
}

BookSt.args = book1;
BookSt.storyName = "Book";

function StoryControls({
  autoRotate,
  children,
}: React.PropsWithChildren<{ autoRotate: boolean }>) {
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
  autoRotate: false,
  showAxes: false,
} as const;

const defaultStoryArgTypes = {
  coverRotation: {
    control: {
      type: "range",
      min: 0,
      max: 90,
    },
  },

  booksNumber: {
    control: {
      type: "range",
      min: 1,
      max: 600,
    },
  },
};

type ShelfStory = StoryObj<typeof defaultStoryArgs>;

export const ShelfSt: ShelfStory = {
  name: "Shelf",
  args: defaultStoryArgs,
  argTypes: defaultStoryArgTypes,
  parameters: {
    docs: {
      story: { inline: true, height: "700px", className: "p-5 bg-[blue]" },
    },
  },
  render: ({
    booksNumber,
    coverRotation,
    showAxes,
    ...rest
  }: typeof defaultStoryArgs) => {
    return (
      <Setup lights={false} orbitControls={false} axesHelper={showAxes}>
        <StoryControls {...rest}>
          <Shelf position={[-100, 100, 15]} bookRotation={coverRotation}>
            {buildBooks(booksNumber).map((book, index) => (
              <Book key={index} {...book} />
            ))}
          </Shelf>
        </StoryControls>
      </Setup>
    );
  },
};

export function RoomSt({
  showAxes,
  coverRotation,
  booksNumber,
  ...rest
}: typeof defaultStoryArgs) {
  const [books, setBooks] = React.useState(buildBooks(booksNumber));
  const [editBook, setEditBook] = React.useState<
    (EditBookProps & BookEditMode) | null
  >(null);

  const handleEdit = React.useCallback(
    (book: EditBookProps & BookEditMode) => {
      setEditBook((prev) => ({ ...prev, ...book }));
    },
    [editBook],
  );

  const handleEditClose = React.useCallback(() => {
    if (!editBook) {
      return;
    }
    const nextState = produce(books, (draft) => {
      const index = books.findIndex((b) => b.isbn === editBook.isbn);
      // @ts-expect-error
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
    [],
  );

  return (
    <>
      {editBook && (
        <Box
          component="div"
          bgcolor="rgba(0,0,0, .5)"
          position="absolute"
          display="flex"
          alignItems="center"
          borderRadius={7}
          height="100%"
          zIndex="100"
          top={0}
          right={0}
          p={4}
          style={{ backdropFilter: "blur(15px)" }}
        >
          <Box component="div" m="auto">
            <EditBook
              key={editBook.isbn}
              book={editBook}
              // @ts-expect-error
              onChange={handleEdit}
              onClose={handleEditClose}
            />
          </Box>
        </Box>
      )}

      <Setup lights={false} orbitControls={false} axesHelper={showAxes}>
        <StoryControls {...rest}>
          <Room
            books={books}
            // @ts-expect-error
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

type BookEditMode = {
  position: THREE.Vector3Tuple;
};

interface RoomProps {
  editBook: EditBookProps & BookEditMode;
  books: EditBookProps[];
  onSelect: (book: EditBookProps, e: any) => void;
  coverRotation: number;
}

function Room({ books, editBook, onSelect, coverRotation }: RoomProps) {
  const step = 0.1;
  const zoom = Boolean(editBook);

  useFrame((state) => {
    if (zoom) {
      state.camera.position.lerp(new THREE.Vector3(10, 1, 100), step);
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
          <Shelf bookRotation={coverRotation}>
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

function BookEditMode(props: BookEditMode) {
  const { position, ...rest } = props;

  const coverRotation = Rotation.Cover;
  const [rotation, setRotation] = React.useState(coverRotation);

  const positionProps = useSpring({
    to: {
      position: [0, 0, 80],
    },
    from: {
      position: [position[0], position[1] + 10, position[2]],
    },
    reset: false,
  } as const);

  const rotationProps = useSpring<React.ComponentProps<typeof a.mesh>>({
    to: {
      rotation: [0, rotation, 0],
    },
    from: {
      rotation: [0, rotation - THREE.MathUtils.degToRad(-180), 0],
    },
    reset: false,
  });

  const handleMove = () => {
    setRotation(rotation + coverRotation);
  };

  return (
    <a.mesh {...positionProps} {...rotationProps}>
      <Book {...rest} rotation={[0, 0, 0]} onPointerDown={handleMove} />
    </a.mesh>
  );
}
