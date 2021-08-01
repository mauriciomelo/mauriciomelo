import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import * as R from "ramda";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { createToggleService } from "../services/toggles";

export default function Toggles() {
  const router = useRouter();
  const [toggles, setToggles] = React.useState({});
  const [sha, setSha] = React.useState("");
  const [path, setPath] = React.useState("");
  const [service, setService] = React.useState<
    ReturnType<typeof createToggleService>
  >();

  console.log("path", router.query.path);

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
    router.push({
      query: {
        path: encodeURI(target.value),
      },
    });
  };

  const title = titleFromPath(path);

  React.useEffect(() => {
    if (!Array.isArray(router.query.path)) {
      setPath(router.query.path || "");
    }
  }, [router.query.path]);

  React.useEffect(() => {
    if (service && path) {
      service.getToggles(path).then(({ toggles, sha }) => {
        setToggles(toggles);
        setSha(sha);
      });
    }
  }, [service, path, sha]);

  if (!service) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Auth onChange={handleTokenChange} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        padding: 4,
        paddingTop: 10,
        margin: "auto",
        maxWidth: 600,
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Head>
        <title>{title}</title>
      </Head>

      <Typography
        sx={{ textTransform: "capitalize" }}
        variant="h3"
        gutterBottom
        component="h1"
      >
        {title}
      </Typography>

      <FormControl component="fieldset">
        <Box sx={{ mb: 5 }}>
          <form>
            <TextField
              name="path"
              value={path}
              placeholder="owner/repo/file.json"
              label="file path"
              onChange={handlePathChange}
              variant="standard"
              fullWidth
            />
          </form>
        </Box>
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

function titleFromPath(path: string) {
  const fileName = R.pipe(R.split("/"), R.last, R.replace(".json", ""))(path);
  return fileName;
}

export function Auth(props) {
  const { control, handleSubmit } = useForm({ mode: "onChange" });
  const onSubmit = (data) => {
    props.onChange(data);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="overline">Authenticate</Typography>

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
                variant="filled"
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
