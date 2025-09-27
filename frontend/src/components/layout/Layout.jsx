import { Box } from "@mui/material";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "background.default",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          overflow: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
