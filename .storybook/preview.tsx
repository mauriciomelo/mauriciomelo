import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

const cache = createCache({ key: "css", prepend: true });
cache.compat = true;
import "./index.css";
import theme from "../src/theme";

export const decorators = [
  (Story) => (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {Story()}
      </ThemeProvider>
    </CacheProvider>
  ),
];
