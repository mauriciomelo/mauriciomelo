import React from "react";
import {
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Link,
  Switch,
  TextField,
} from "@material-ui/core";
import { Octokit } from "@octokit/core";

async function getToggles(token) {
  const octokit = new Octokit({
    auth: token,
  });
  const { data } = await octokit.request(
    "GET /repos/mauriciomelo/deva/contents/package.json",
    {
      owner: "octocat",
      repo: "hello-world",
      path: "path",
    }
  );

  const buff = Buffer.from(data.content, "base64");
  const packageJSON = buff.toString("ascii");
  const packageObject = JSON.parse(packageJSON);

  console.log(packageObject);
}

export default function Toggles() {
  const [state, setState] = React.useState({
    toggle: true,
  });
  const [token, setToken] = React.useState();

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  const handleTokenChange = (event) => {
    setToken(event.target.value);
  };

  React.useEffect(() => {
    getToggles(token);
  }, [token]);

  return (
    <Container>
      <TextField label="GH Token" onChange={handleTokenChange}></TextField>
      <FormControl component="fieldset">
        <FormLabel component="legend">Toggles</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={state.toggle}
                onChange={handleChange}
                name="toggle"
              />
            }
            label="toggle"
          />
        </FormGroup>
      </FormControl>

      <Link
        target="_blank"
        href="https://github.com/apps/deva-gh-app/installations/new"
      >
        login
      </Link>
    </Container>
  );
}
