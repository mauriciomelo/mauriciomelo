import React from "react";
import { Box } from "@mui/material";
import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.min.css";

export type EditorProps = {
  json?: unknown;
  schema?: unknown;
  onChange?: (changes: unknown) => void;
};
export function Editor({ json = {}, schema = {}, onChange }: EditorProps) {
  const containerRef = React.useRef();
  const editorRef = React.useRef<any>();

  React.useEffect(() => {
    if (editorRef.current) {
      return;
    }

    const options = {
      mode: "form",
      onChangeJSON: onChange,
    };
    editorRef.current = new JSONEditor(containerRef.current, options);
  }, []);

  React.useEffect(() => {
    if (editorRef.current) {
      editorRef.current.update(json);
      editorRef.current.setSchema(schema);
    }
  }, [editorRef.current, json, schema]);

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "#0f0f0f",
        borderRadius: 1,
        ".jsoneditor-search .jsoneditor-frame": {
          backgroundColor: "#ffffff1a",
          color: "white",
          p: "3px",
          borderRadius: 1,
        },
        ".jsoneditor, .jsoneditor-tree, .jsoneditor-menu, .jsoneditor-navigation-bar, .jsoneditor-frame, .jsoneditor-frame input":
          {
            backgroundColor: "transparent",
            border: "none",
            color: "white",
          },
        ".jsoneditor-treepath, .jsoneditor-value": {
          color: "#444444",
        },
        ".jsoneditor-field": {
          color: "secondary.main",
        },
        ".jsoneditor-highlight": {
          color: "black",
        },
      }}
    >
      <div ref={containerRef}></div>
    </Box>
  );
}
