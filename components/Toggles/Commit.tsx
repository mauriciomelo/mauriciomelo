import React from "react";
import { Button, InputAdornment, OutlinedInput } from "@mui/material";

export function Commit(props) {
  return (
    <form onSubmit={props.handleCommit} autoComplete="off">
      <OutlinedInput
        id="outlined-adornment-amount"
        placeholder="commit message"
        required
        inputProps={{ maxLength: 50 }}
        fullWidth
        value={props.message}
        onChange={(e) => props.setMessage?.(e.target.value)}
        endAdornment={
          <InputAdornment position="start">
            <Button variant="contained" type="submit" disabled={!props.valid}>
              Commit changes
            </Button>
          </InputAdornment>
        }
      />
    </form>
  );
}
