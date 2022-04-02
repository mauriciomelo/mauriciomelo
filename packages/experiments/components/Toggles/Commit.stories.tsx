import React from "react";
import { Commit } from "./Commit";

export default {
  title: "Toggles/Commit",
  component: Commit,
};

export const Main = () => {
  return <Commit valid />;
};
