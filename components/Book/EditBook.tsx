import { Box, Button, TextField } from "@material-ui/core";
import React from "react";
import { Controller, useForm } from "react-hook-form";

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

export function EditBook() {
  const { control, handleSubmit, watch } = useForm({ mode: "onChange" });
  const onSubmit = (data) => console.log(data);

  return (
    <Box m={5} maxWidth={300}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((f) => (
          <Controller
            name={f.name}
            key={f.name}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                label={f.label}
                placeholder={f.placeholder}
                variant="outlined"
                inputProps={field}
              />
            )}
          />
        ))}

        <Button type="submit">Submit</Button>
      </form>
    </Box>
  );
}
