import React from "react";
import { Book } from "../components/Book/Book";
import { Setup } from "../.storybook/Setup";

const BooksPage = () => {
  return (
    <Setup>
      <Book />
    </Setup>
  );
};

export default BooksPage;
