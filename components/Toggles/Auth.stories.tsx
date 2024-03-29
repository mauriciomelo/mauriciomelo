import React from "react";
import { Auth } from "./Auth";

export default {
  title: "Toggles/Auth",
  component: Auth,
};

export const Main = () => {
  return <Auth onChange={() => {}} />;
};
