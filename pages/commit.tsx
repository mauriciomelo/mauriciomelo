import React from "react";
import { Autocomplete, TextField, Box } from "@mui/material";
import { curry } from "ramda";

const commitArgs = [
  "scope",
  "message",
  "changeType",
  "ss another",
  "co-author",
];

const exec = curry((path, cmd) => {
  console.log("aqui");

  const shell = window.require("child_process");

  console.log(`> ${cmd}`);
  try {
    const out = shell.execSync(cmd);
    return out.toString();
  } catch (e) {
    console.error(e);
    process.exitCode = e.status;
    return e.toString();
  }
});

export default function Commit() {
  const [output, setOutput] = React.useState("");
  const handleChange = React.useCallback(
    (e) => setOutput(exec("~", e.target.value)),
    []
  );

  return (
    <Box bgcolor="white">
      <Autocomplete
        id="grouped-demo"
        options={commitArgs}
        freeSolo
        onChange={handleChange}
        getOptionLabel={(option) => option}
        style={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="shell commands" variant="outlined" />
        )}
      />

      <Box>
        <pre>{output}</pre>
      </Box>
    </Box>
  );
}
