import * as React from "react";
import { Book, BookProps } from "./Book";
import { Setup } from "../../.storybook/Setup";

export default {
  title: "Book",
  component: Setup,
  decorators: [(storyFn) => <Setup>{storyFn()}</Setup>],
};

const args: BookProps = {
  position: [0, 0, 0],
  width: 3.23,
  height: 23,
  depth: 15.8,
  frontCoverUrl:
    "https://images-na.ssl-images-amazon.com/images/I/612-pygu-NL.jpg",

  backCoverUrl:
    "https://images-na.ssl-images-amazon.com/images/I/71Dtwko9OyL.jpg",
};

export function Main(args: BookProps) {
  return <Book {...args} />;
}

Main.args = args;
