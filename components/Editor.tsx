import React from "react";
import {
  Box,
  Button,
  TextField,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import JSONEditor from "jsoneditor";

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
      schema,
      onChangeJSON: onChange,
    };
    editorRef.current = new JSONEditor(containerRef.current, options);
  }, []);

  React.useEffect(() => {
    if (editorRef.current) {
      editorRef.current.update(json);
      editorRef.current.expandAll(json);
    }
  }, [editorRef.current, json]);

  return (
    <Box>
      <div ref={containerRef}></div>
    </Box>
  );
}
