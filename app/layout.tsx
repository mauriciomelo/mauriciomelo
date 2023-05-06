import "../styles/globals.css";

export default function Layout({ children }) {
  return (
    <html lang="en" className="dark ">
      <head>
        <title>Mauricio Melo</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="dark:text-white">{children}</body>
    </html>
  );
}
