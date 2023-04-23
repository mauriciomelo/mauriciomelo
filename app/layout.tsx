import "../styles/globals.css";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Mauricio Melo</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
