import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { curry } from 'ramda';
import { Box } from '@material-ui/core';

const commitArgs = [
  'scope',
  'message',
  'changeType',
  'ss another',
  'co-author',
];

const exec = curry((path, cmd) => {
  console.log('aqui');

  const shell = window.require('child_process');

  console.log(`> ${cmd}`);
  try {
    const out = shell.execSync(cmd);
    return out.toString();
  } catch (e) {
    console.error(e);
    return e.toString();
    process.exitCode = e.status;
  }
});

export default function Commit() {
  const [output, setOutput] = React.useState('');
  const handleChange = React.useCallback(
    e => setOutput(exec('~', e.target.value)),
    []
  );

  return (
    <Box bgcolor="white">
      <Autocomplete
        id="grouped-demo"
        options={commitArgs}
        freeSolo
        onChange={handleChange}
        getOptionLabel={option => option}
        style={{ width: 300 }}
        renderInput={params => (
          <TextField {...params} label="shell commands" variant="outlined" />
        )}
      />

      <Box>
        <pre>{output}</pre>
      </Box>
    </Box>
  );
}
