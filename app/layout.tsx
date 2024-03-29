import { PropsWithChildren } from "react";
import "../styles/globals.css";
import ThemeRegistry from "./ThemeRegistry";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="dark ">
      <head>
        <title>Mauricio Melo</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="dark:text-white">
        <ThemeRegistry options={{ key: "mui" }}>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
