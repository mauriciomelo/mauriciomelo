"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeRegistry from "./ThemeRegistry";
import { PropsWithChildren } from "react";
const queryClient = new QueryClient();

export function Providers(props: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeRegistry options={{ key: "mui" }}>{props.children}</ThemeRegistry>
    </QueryClientProvider>
  );
}
