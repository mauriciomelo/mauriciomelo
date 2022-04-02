import React from "react";
import { TextField } from "@material-ui/core";

export function Configuration(props) {
  return (
    <form>
      <TextField
        name="path"
        defaultValue={props.path}
        placeholder="owner/repo/file.json"
        label="file path"
        onBlur={props.handlePathChange}
        variant="outlined"
        fullWidth
        sx={{
          mb: 3,
        }}
      />
      <TextField
        name="schemaPath"
        defaultValue={props.schemaPath}
        placeholder="owner/repo/file.json"
        label="schema path"
        onBlur={props.handlePathChange}
        variant="outlined"
        fullWidth
        sx={{
          mb: 3,
        }}
      />

      <TextField
        name="docPath"
        defaultValue={props.docPath}
        placeholder="owner/repo/doc.md"
        label="doc path"
        onBlur={props.handlePathChange}
        variant="outlined"
        fullWidth
      />
    </form>
  );
}
