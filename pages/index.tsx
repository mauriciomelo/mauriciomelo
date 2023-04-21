import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Button, Typography } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Mauricio Melo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Typography
          variant="h1"
          gutterBottom
          sx={{
            fontSize: { xs: 57, md: 100 },
          }}
        >
          Mauricio Melo
        </Typography>

        <Button
          href="https://github.com/mauriciomelo"
          variant="text"
          startIcon={<GitHubIcon />}
          sx={{ textTransform: "lowercase" }}
        >
          github.com/mauriciomelo
        </Button>
      </main>
    </div>
  );
}
