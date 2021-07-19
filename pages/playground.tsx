import { Box, Grid } from "@material-ui/core";
import React from "react";
import { Book } from "../components/Book/Book";
import { Setup } from "../.storybook/Setup";
import { myBooks } from "../components/Book/myBooks";
import produce from "immer";
import { CoverMaker } from "../components/Book/CoverMaker";

const Playground = () => {
  const [image, setImage] = React.useState();

  const [books, setBooks] = React.useState([myBooks[0], myBooks[1]]);

  const hancleMakeCover = (book) => {
    const newBooks = produce(books, (draft) => {
      const bookIndex = draft.findIndex((b) => b.isbn === book.isbn);
      draft[bookIndex] = { ...draft[bookIndex], ...book };
    });
    setBooks(newBooks);
  };

  return (
    <Box>
      <Grid container>
        <Grid xs={6} item>
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
            }}
          >
            {books.map((b) => (
              <CoverMaker key={b.isbn} book={b} onChange={hancleMakeCover} />
            ))}
          </Box>
        </Grid>

        <Grid xs={6} item>
          <Box sx={{ height: "100vh" }}>
            <Setup cameraPosition={[0, 0, 20]}>
              {books.map((b, i) => (
                <Book leather key={b.isbn} {...b} position={[0, i * 30, 0]} />
              ))}
            </Setup>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Playground;
