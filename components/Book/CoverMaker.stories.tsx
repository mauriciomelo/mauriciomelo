import { Box, Typography } from "@mui/material";
import React, { ComponentProps } from "react";
import { Setup } from "../../.storybook/Setup";
import { Book } from "./Book";
import { CoverMaker, CoverProps } from "./CoverMaker";

export default {
  title: "3D/BookShelf/CoverMaker",
  component: CoverMaker,
};

const book = {
  isbn: "424242",
  title: "The Drunkard's Walk: How Randomness Rules Our Lives",
  author: "Leonard Mlodinow",
};
export const Cover = (args: ComponentProps<typeof CoverMaker>) => {
  return <CoverMaker {...args} />;
};

Cover.args = {
  book: {
    ...book,
    title: "The Drunkard's Walk: How Randomness Rules Our Lives",
  },
};

export const SingleTitle = (args: ComponentProps<typeof CoverMaker>) => {
  return <CoverMaker {...args} />;
};

SingleTitle.args = {
  book: {
    ...book,
    title: "The Drunkard's Walk",
  },
};

export const RenderVsTextureVsOriginal = (
  args: ComponentProps<typeof CoverMaker>,
) => {
  return <Media {...args} />;
};

function Media(props: any) {
  const [images, setImages] = React.useState<CoverProps>();

  return (
    <Box component="div" sx={{ display: "flex", flexDirection: "row" }}>
      <Box component="div" marginX={2}>
        <Typography variant="h4">3D</Typography>
        <Box component="div" sx={{ width: "18cm", height: "25cm" }}>
          <Setup cameraPosition={[0, 0, 20]}>
            <Book
              leather
              {...{ ...props.book, ...images }}
              position={[0, 0, 0]}
            />
          </Setup>
        </Box>
      </Box>
      <Box component="div" marginX={2}>
        <Typography variant="h4">Image</Typography>
        <Box component="div" sx={{ display: "flex", flexDirection: "row" }}>
          <img src={images?.spine} />
          <img src={images?.cover} />
        </Box>
      </Box>
      <Box component="div" marginX={2}>
        <Typography variant="h4">Original</Typography>
        <CoverMaker book={props.book} onChange={setImages} />
      </Box>
    </Box>
  );
}
RenderVsTextureVsOriginal.args = {
  book: book,
};
