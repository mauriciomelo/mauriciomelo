import { Box, Typography } from "@mui/material";
import React from "react";
import html2canvas from "html2canvas";
import { publicUrl } from "../../src/publicUrl";
import { Book as BooksProps } from "./getBooks";
import { useDebounceCallback } from "@react-hook/debounce";

export const CoverMaker = React.memo((props: CoverMakerProps) => {
  const [cover, captureRef] = useImageUrl([props.book.title]);
  const [spine, spineRef] = useImageUrl([props.book.title]);

  React.useEffect(() => {
    if (cover && spine && props.onChange) {
      props.onChange({ ...props.book, cover, spine, backCover: cover });
    }
  }, [cover, props, spine]);

  const [title, subtitle] = props.book.title.split(": ");
  const bgcolor = "black";
  const color = "gold";

  return (
    <Box
      component="div"
      sx={{ display: "flex", flexDirection: "row", marginBottom: 2 }}
    >
      <Box
        component="div"
        ref={spineRef}
        sx={{
          color,
          height: "23cm",
          width: "3cm",
          textAlign: "center",
          bgcolor,
          backgroundImage: `url(${publicUrl(
            "/textures/black-leather-texture.jpeg"
          )})`,
          backgroundSize: "cover",
        }}
      >
        <Box
          component="div"
          sx={{
            width: "23cm",
            transformOrigin: "bottom left",
            marginX: 4,
            transform: "rotate(90deg)",
          }}
        >
          <Typography variant="h5">{title}</Typography>
        </Box>
      </Box>

      <Box
        component="div"
        ref={captureRef}
        sx={{
          p: 4,
          color,
          height: "23cm",
          width: "15cm",
          textAlign: "center",
          bgcolor,
          backgroundImage: `url(${publicUrl(
            "/textures/black-leather-texture.jpeg"
          )})`,
          backgroundSize: "cover",
        }}
      >
        <Typography sx={{ marginY: 5 }} variant="h1">
          {title}
        </Typography>
        <Typography variant="h3" component="h2">
          {subtitle}
        </Typography>

        <Typography
          sx={{ marginY: 5, textTransform: "uppercase" }}
          variant="h6"
          component="h3"
        >
          {props.book.author}
        </Typography>
      </Box>
    </Box>
  );
});

CoverMaker.displayName = "CoverMaker";

export type CoverProps = Pick<
  BooksProps,
  "isbn" | "cover" | "backCover" | "spine"
>;

export type CoverMakerBookProps = Pick<
  BooksProps,
  "isbn" | "title" | "author" | "width" | "height" | "depth"
>;

interface CoverMakerProps {
  book: CoverMakerBookProps;
  onChange?: (book: CoverProps) => void;
}
function useImageUrl(dependencies: unknown[] = []) {
  const ref = React.useRef();

  const [imageUrl, setImageUrl] = React.useState<string | undefined>();

  const update = useDebounceCallback(() => {
    if (ref.current) {
      html2canvas(ref.current).then((canvas) =>
        setImageUrl(canvas.toDataURL())
      );
    }
  }, 1000);

  React.useEffect(() => {
    setTimeout(update, 300);
  }, [update]);

  React.useEffect(() => {
    if (ref.current) {
      update();
    }
  }, dependencies);

  return [imageUrl, ref] as const;
}
