import React from "react";
import { Editor } from "./Editor";

export default {
  title: "Toggles/Editor",
  component: Editor,
};

const toggles = {
  cart_button: false,
  user_profile: false,
  cancel_plan: {
    id: "someid",
    variants: [
      { name: "true", value: true },
      { name: "false", value: false },
    ],
    value: { true: 0.5, false: 0.3 },
  },
};

export const Main = () => {
  return <Editor json={toggles} />;
};
