import React from "react";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  OutlinedInput,
  TextField,
  Typography,
} from "@material-ui/core";
import * as R from "ramda";
import Head from "next/head";
import { useRouter } from "next/router";
import "jsoneditor/dist/jsoneditor.min.css";
import dynamic from "next/dynamic";

import { useForm, Controller } from "react-hook-form";
import { createToggleService } from "../services/toggles";
import { EditorProps } from "../components/Editor";

const Editor = dynamic(
  () => import("../components/Editor").then(({ Editor }) => Editor) as any,
  {
    ssr: false,
  }
) as React.FC<EditorProps>;

export default function Toggles() {
  const router = useRouter();
  const [toggles, setToggles] = React.useState({});
  const [message, setMessage] = React.useState("");
  const [path, setPath] = React.useState("");
  const [service, setService] = React.useState<
    ReturnType<typeof createToggleService>
  >();

  const handleChange = async (changes) => {
    setToggles(changes);
  };

  const handleCommit = async (e) => {
    e.preventDefault();
    const current = await service.getToggles(path);
    const next = { ...current.toggles, ...toggles };

    await service.updateToggles({
      path,
      sha: current.sha,
      toggles: next,
      message,
    });
    setToggles(next);
    setMessage("");
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
      service.getToggles(path).then(({ toggles }) => {
        setToggles(toggles);
      });
    }
  }, [service, path]);

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

        <Editor json={toggles} onChange={handleChange} />

        <Box mt={4}>
          <form onSubmit={handleCommit}>
            <OutlinedInput
              id="outlined-adornment-amount"
              placeholder="commit message"
              required
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              endAdornment={
                <InputAdornment position="start">
                  <Button variant="contained" type="submit">
                    Commit changes
                  </Button>
                </InputAdornment>
              }
            />
          </form>
        </Box>
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
