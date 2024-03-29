import { Box, Button, Typography } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function Home() {
  return (
    <Box
      component="div"
      sx={{
        textAlign: "center",
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: 57, md: 100 },
          fontWeight: "bold",
          color: "common.white",
          pt: "200px",
          pb: 2,
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
    </Box>
  );
}
