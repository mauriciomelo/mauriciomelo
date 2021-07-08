import { Box, Button, TextField } from "@material-ui/core";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Book } from "./getBooks";

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
  book?: Book;
  onChange?: (book: Book) => void;
  onClose?: () => void;
}
export function EditBook(props: EditBookProps) {
  const { control, handleSubmit, watch } = useForm({ mode: "onChange" });
  const onSubmit = (data) => {
    props.onChange(data);
  };

  watch((data: Book) => props.onChange(data));

  return (
    <Box m={5} maxWidth={300}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((f) => (
          <Box key={f.name} marginY={2}>
            <Controller
              name={f.name}
              control={control}
              defaultValue={props.book[f.name] || ""}
              render={({ field }) => (
                <TextField
                  label={f.label}
                  placeholder={f.placeholder}
                  variant="outlined"
                  inputProps={field}
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
