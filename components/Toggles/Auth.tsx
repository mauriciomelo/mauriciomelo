import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

export function Auth(props) {
  const { control, handleSubmit } = useForm({ mode: "onChange" });
  const onSubmit = (data) => {
    props.onChange(data);
  };

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="overline">Authenticate</Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box component="div" marginY={2}>
          <Controller
            name="ghToken"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                placeholder="GitHub Token"
                type="password"
                inputProps={field}
                variant="filled"
              />
            )}
          />
        </Box>

        <Box component="div" marginY={2}>
          <Button type="submit" color="primary">
            submit
          </Button>
        </Box>
      </form>
    </Box>
  );
}
