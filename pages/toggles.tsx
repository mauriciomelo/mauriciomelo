import React from "react";
import {
  Box,
  Button,
  InputAdornment,
  OutlinedInput,
  Popover,
  TextField,
  Typography,
} from "@material-ui/core";
import * as R from "ramda";
import Head from "next/head";
import { useRouter } from "next/router";
import "jsoneditor/dist/jsoneditor.min.css";
import dynamic from "next/dynamic";
import Ajv from "ajv";
import { useForm, Controller } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { createToggleService } from "../services/toggles";
import { EditorProps } from "../components/Editor";

const ajv = new Ajv();

const Editor = dynamic(
  () => import("../components/Editor").then(({ Editor }) => Editor) as any,
  {
    ssr: false,
  }
) as React.FC<EditorProps>;

export default function Toggles() {
  const [service, setService] = React.useState<
    ReturnType<typeof createToggleService>
  >();
  const router = useRouter();
  const [message, setMessage] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);

  const { path, schemaPath, docPath } = router.query;

  const [toggles, setToggles] = useFile(service, { path });
  const [schema] = useFile(service, { path: schemaPath });
  const [doc] = useFile(service, { path: docPath, parseJson: false });

  const handleChange = async (changes) => {
    setToggles(changes);
  };

  const handleConfigure = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleConfigureClose = () => {
    setAnchorEl(null);
  };

  const handleCommit = async (e) => {
    e.preventDefault();
    const current = await service.getToggles({ path });
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
    console.log(target);
    router.push({
      query: {
        ...router.query,
        [target.name]: encodeURI(target.value),
      },
    });
  };

  const title = titleFromPath(path);
  const validate = ajv.compile(schema);
  const valid = validate(toggles);

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
      <Box
        sx={{
          py: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography component="h2" variant="subtitle2" color="gray">
          {path}
        </Typography>
        <Button color="secondary" onClick={handleConfigure}>
          Configure
        </Button>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleConfigureClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Box sx={{ p: 4, width: 500 }}>
            <form>
              <TextField
                name="path"
                defaultValue={path}
                placeholder="owner/repo/file.json"
                label="file path"
                onBlur={handlePathChange}
                variant="outlined"
                fullWidth
                sx={{ mb: 3 }}
              />
              <TextField
                name="schemaPath"
                defaultValue={schemaPath}
                placeholder="owner/repo/file.json"
                label="schema path"
                onBlur={handlePathChange}
                variant="outlined"
                fullWidth
                sx={{ mb: 3 }}
              />

              <TextField
                name="docPath"
                defaultValue={docPath}
                placeholder="owner/repo/doc.md"
                label="doc path"
                onBlur={handlePathChange}
                variant="outlined"
                fullWidth
              />
            </form>
          </Box>
        </Popover>
      </Box>
      <Editor json={toggles} schema={schema} onChange={handleChange} />
      <Box mt={4}>
        <form onSubmit={handleCommit} autoComplete="off">
          <OutlinedInput
            id="outlined-adornment-amount"
            placeholder="commit message"
            required
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            endAdornment={
              <InputAdornment position="start">
                <Button variant="contained" type="submit" disabled={!valid}>
                  Commit changes
                </Button>
              </InputAdornment>
            }
          />
        </form>
      </Box>

      <Box sx={{ py: 10 }}>
        <ReactMarkdown children={doc} />
      </Box>
    </Box>
  );
}

function titleFromPath(path: string[] | string = "") {
  if (Array.isArray(path)) {
    return;
  }

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

function useFile(
  service,
  { path, parseJson }: { path: string | string[]; parseJson?: boolean }
): [file: any, setFile: React.Dispatch<React.SetStateAction<{}>>] {
  const [file, setFile] = React.useState({});

  React.useEffect(() => {
    if (service && path) {
      service.getToggles({ path, parseJson }).then(({ toggles }) => {
        setFile(toggles);
      });
    }
  }, [service, path]);
  return [file, setFile];
}
