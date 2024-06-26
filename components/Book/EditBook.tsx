import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Book, parseDimentions } from "./getBooks";

const fields = [
  { name: "title", label: "Title" },
  { name: "isbn", label: "ISBN" },
  { name: "author", label: "Author" },
  { name: "pages", label: "Pages" },
  { name: "cover", label: "Cover" },
  { name: "backCover", label: "Back Cover" },
  {
    name: "dimentions",
    label: "Dimentions",
    placeholder: "15.24 x 2.39 x 22.86 cm",
  },
];

interface EditBookProps {
  book: Book;
  onChange?: (book: Book) => void;
  onClose?: () => void;
}

export function EditBook(props: EditBookProps) {
  const { control, handleSubmit, watch } = useForm({ mode: "onChange" });

  // @ts-expect-error

  const onSubmit = (data) => {
    props.onChange?.(buildBook(data));
  };
  // @ts-expect-error

  watch((data: Book) => props.onChange?.(buildBook(data)));

  return (
    <Box component="div" m={5} width={450}>
      <Box component="div" marginBottom={4}>
        <Typography variant="overline">Edit Book</Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((f) => (
          <Box component="div" key={f.name} marginY={2}>
            <Controller
              name={f.name}
              control={control}
              defaultValue={getDefaultValue(props.book, f.name)}
              render={({ field }) => (
                <TextField
                  label={f.label}
                  placeholder={f.placeholder}
                  variant="outlined"
                  inputProps={field}
                  fullWidth
                />
              )}
            />
          </Box>
        ))}

        <Button onClick={props.onClose}>Close</Button>
      </form>
    </Box>
  );
}
function getDefaultValue(book: Book, fieldName: string): unknown {
  if (fieldName === "dimentions") {
    return `${book.width} x ${book.depth} x ${book.height} cm `;
  }
  // @ts-expect-error
  return book[fieldName] || "";
}

// @ts-expect-error
function buildBook(change) {
  const { dimentions, ...rest } = change;
  return { ...rest, ...parseDimentions(dimentions) };
}
