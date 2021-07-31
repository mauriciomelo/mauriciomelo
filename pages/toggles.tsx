import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";
import { createToggleService } from "../services/toggles";

export default function Toggles() {
  const [toggles, setToggles] = React.useState({});
  const [sha, setSha] = React.useState("");
  const [path, setPath] = React.useState("");
  const [service, setService] = React.useState<
    ReturnType<typeof createToggleService>
  >();

  const handleChange = async (event) => {
    const updatedToggles = {
      ...toggles,
      [event.target.name]: event.target.checked,
    };
    setToggles(updatedToggles);
    const conntet = await service.updateToggles(path, sha, updatedToggles);
    setSha(conntet.sha);
  };
  const handleTokenChange = ({ ghToken }) => {
    setService(createToggleService(ghToken));
  };
  const handlePathChange = ({ target }) => {
    setPath(target.value);
  };

  React.useEffect(() => {
    if (service && path) {
      service.getToggles(path).then(({ toggles, sha }) => {
        setToggles(toggles);
        setSha(sha);
      });
    }
  }, [service, path, sha]);

  return (
    <Box
      sx={{
        marginX: "auto",
        marginTop: 5,
        width: 300,
      }}
    >
      {!service && <Auth onChange={handleTokenChange} />}
      <Box marginY={2}>
        <form>
          <TextField
            name="path"
            label="file path"
            onChange={handlePathChange}
          />
        </form>
      </Box>

      <FormControl component="fieldset">
        <FormLabel component="legend">{path}</FormLabel>
        <FormGroup>
          {Object.keys(toggles).map((key) => (
            <FormControlLabel
              key={key}
              control={
                <Switch
                  checked={toggles[key]}
                  onChange={handleChange}
                  name={key}
                />
              }
              label={key}
            />
          ))}
        </FormGroup>
      </FormControl>
    </Box>
  );
}

export function Config(props) {
  const { control, handleSubmit, watch } = useForm({ mode: "onChange" });
  const onSubmit = (data) => {
    props.onChange(data);
  };

  // watch((data) => props.onChange(data));

  return (
    <Box m={5} maxWidth={300}>
      <Box marginBottom={4}>
        <Typography variant="overline">Configuration</Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box marginY={2}>
          <Controller
            name="ghToken"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                label="GitHub Token"
                type="password"
                variant="outlined"
                inputProps={field}
              />
            )}
          />
        </Box>
        <Box marginY={2}>
          <Controller
            name="path"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                label="File path"
                placeholder="org/repo/file.json"
                variant="outlined"
                inputProps={field}
              />
            )}
          />
        </Box>

        <Box marginY={2}>
          <Button type="submit">submit</Button>
        </Box>
      </form>
    </Box>
  );
}

export function Auth(props) {
  const { control, handleSubmit } = useForm({ mode: "onChange" });
  const onSubmit = (data) => {
    props.onChange(data);
  };

  return (
    <Box>
      <Box marginBottom={4}>
        <Typography variant="overline">Authenticate</Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box marginY={2}>
          <Controller
            name="ghToken"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                placeholder="GitHub Token"
                type="password"
                inputProps={field}
              />
            )}
          />
        </Box>

        <Box marginY={2}>
          <Button type="submit">submit</Button>
        </Box>
      </form>
    </Box>
  );
}
