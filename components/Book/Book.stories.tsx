import * as React from "react";
import * as THREE from "three";
import { Book, BookProps } from "./Book";
import { Setup } from "../../.storybook/Setup";
import { useHelper } from "@react-three/drei";
import axios from "axios";
import csv from "csvtojson";
import { OrbitControls } from "../OrbitControl";
import { Flex, Box } from "@react-three/flex/dist/index.cjs";
import { Shelf } from "./Shelf";

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

const myBooks = [
  {
    title:
      "Billions & Billions: Thoughts on Life and Death at the Brink of the Millennium",
    author: "Carl Sagan",
    pages: 296,
    isbn: "9780345379184",
    dimentions: "18.03 x 12.7 x 1.52 cm",
    cover: "https://images-na.ssl-images-amazon.com/images/I/81NaEXIPLDL.jpg",
    backCover:
      "https://images-na.ssl-images-amazon.com/images/I/81zQaDaQJ3L.jpg",
  },

  {
    title: "21 Lessons for the 21st Century",
    author: "Yuval Noah Harari",
    pages: 372,
    isbn: "9780525512172",
    dimentions: "15.24 x 2.39 x 22.86 cm",
    cover: "https://images-na.ssl-images-amazon.com/images/I/610s3RW+fML.jpg",
    backCover:
      "https://images-na.ssl-images-amazon.com/images/I/71ZJ1kgxmgL.jpg",
  },
  {
    title: "To Sell is Human: The Surprising Truth About Moving Others",
    author: "Daniel H. Pink",
    pages: 272,
    isbn: "9781594487156",
    dimentions: "15.75 x 2.54 x 23.62 cm",

    cover: "https://images-na.ssl-images-amazon.com/images/I/71NE6CvV6xL.jpg",
    backCover:
      "https://images-na.ssl-images-amazon.com/images/I/71HcElLpN-L.jpg",
  },

  {
    title:
      "Never Split the Difference: Negotiating As If Your Life Depended On It",
    author: "Chris Voss",
    pages: 274,
    isbn: "9780062407801",

    dimentions: "3.3 x 16 x 23.11 cm",
    cover: "https://images-na.ssl-images-amazon.com/images/I/81oUPEIf6OL.jpg",
    backCover:
      "https://images-na.ssl-images-amazon.com/images/I/81-90tpM84L.jpg",
  },
  {
    title:
      "Accelerate: Building and Scaling High-Performing Technology Organizations",
    author: "Nicole Forsgren",
    pages: 257,
    isbn: "9781942788331",
    dimentions: "14.96 x 2.16 x 23.09 cm",
    cover: "https://images-na.ssl-images-amazon.com/images/I/610tbJ+V-aL.jpg",
    backCover:
      "https://images-na.ssl-images-amazon.com/images/I/610tbJ+V-aL.jpg",
  },
  {
    title: "Dois Irmãos",
    author: "Milton Hatoum",
    pages: 292,
    isbn: "9788535900132",
    dimentions: "17.6 x 12.6 x 1.2 cm",
    cover: "https://images-na.ssl-images-amazon.com/images/I/91lzSUbiyhL.jpg",
    backCover:
      "https://images-na.ssl-images-amazon.com/images/I/81094q3S83L.jpg",
  },
  {
    title: "Darwin Sem Frescura",
    author: "Pirula",
    pages: 256,
    isbn: "9780000185570",
    dimentions: "23 x 15.4 x 1.4 cm",
    cover: "https://images-na.ssl-images-amazon.com/images/I/91W8tUJE0SL.jpg",
    backCover:
      "https://images-na.ssl-images-amazon.com/images/I/81LHgrj8G7L.jpg",
  },
  {
    title: "Leonardo da Vinci",
    author: "Walter Isaacson",
    pages: 600,
    isbn: "9781501139154",
    dimentions: "23.4 x 16 x 3.6 cm",
    cover: "https://images-na.ssl-images-amazon.com/images/I/71110hGfuvL.jpg",
    backCover:
      "https://images-na.ssl-images-amazon.com/images/I/715Tyd6W6nL.jpg",
  },

  {
    title: "Mastering Bitcoin: Unlocking Digital Cryptocurrencies",
    author: "Andreas M. Antonopoulos",
    pages: 298,
    isbn: "9781449374044",
    dimentions: "17.78 x 1.73 x 23.34 cm",
    cover: "https://images-na.ssl-images-amazon.com/images/I/8177WA+ddZL.jpg",
    backCover:
      "https://images-na.ssl-images-amazon.com/images/I/51GexiUqHbL.jpg",
  },

  {
    title: "O Caçador de Pipas",
    author: "Khaled Hosseini",
    pages: 365,
    isbn: "9788520917671",
    dimentions: "19.8 x 13.6 x 1.8 cm",
    cover: "https://images-na.ssl-images-amazon.com/images/I/81yVzXTgLzL.jpg",
    backCover:
      "https://images-na.ssl-images-amazon.com/images/I/812GHgMZA8L.jpg",
  },

  {
    title: "The Drunkard's Walk: How Randomness Rules Our Lives",
    author: "Leonard Mlodinow",
    pages: 252,
    isbn: "9780375424045",
    dimentions: "13.21 x 2.03 x 20.32 cm",
    cover: "https://images-na.ssl-images-amazon.com/images/I/91Qt1C+4GuL.jpg",
    backCover:
      "https://images-na.ssl-images-amazon.com/images/I/81JQvdTp6iL.jpg",
  },

  {
    title: "The Black Swan: The Impact of the Highly Improbable",
    author: "Nassim Nicholas Taleb",
    pages: 480,
    isbn: "9780375424045",
    dimentions: "13.21 x 2.77 x 20.32 cm",
    cover: "https://images-na.ssl-images-amazon.com/images/I/511ggezsKbS.jpg",

    backCover:
      "https://images-na.ssl-images-amazon.com/images/I/71oFYvr0XnS.jpg",
  },
  {
    title: "Antifragile: Things That Gain from Disorder",
    author: "Nassim Nicholas Taleb",
    dimentions: "13.21 x 3.12 x 20.32 cm",
    cover: "https://images-na.ssl-images-amazon.com/images/I/612-pygu-NL.jpg",

    backCover:
      "https://images-na.ssl-images-amazon.com/images/I/71Dtwko9OyL.jpg",
  },
].map((book) => {
  const [width, depth, height] = book.dimentions
    .replace(" cm", "")
    .split("x")
    .map((x) => Number(x))
    .sort((a, b) => a - b);
  return {
    ...book,
    height,
    width,
    depth,
  };
});

export function Main(args: BookProps) {
  return (
    <Setup>
      <Book {...args} />
    </Setup>
  );
}

Main.args = book1;

async function getBooks() {
  const { data } = await axios.get("/goodreads_library_export.csv", {
    responseType: "text",
  });
  const json = await csv().fromString(data);
  const parseIsbn = (str) => str.replace(/"|=|\\/g, "") || undefined;
  const books = json.map((raw) => {
    const isbn = parseIsbn(raw.ISBN13) || parseIsbn(raw.ISBN);

    return {
      title: raw.Title,
      author: raw.Author,
      pages: parseInt(raw["Number of Pages"]),
      isbn,
      cover: `http://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
    };
  });

  const booksWithId = books.filter(({ isbn }) => Boolean(isbn));
  console.log(booksWithId);
  return booksWithId;
}

function useLight() {
  const ref = React.useRef();
  useHelper(ref, THREE.PointLightHelper);
  return ref;
}

function StoryControls({ children }) {
  const topLightRef = useLight();
  const keyLightRef = useLight();
  const bgLightRef = useLight();

  return (
    <>
      {children}
      <OrbitControls autoRotate={false} />

      <pointLight
        ref={topLightRef}
        intensity={0.7}
        position={[100, 300, 150]}
        castShadow
      />

      <pointLight
        ref={keyLightRef}
        intensity={0.4}
        position={[0, 0, 100]}
        castShadow
      />

      <pointLight
        ref={bgLightRef}
        intensity={1}
        position={[0, 10, -100]}
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
