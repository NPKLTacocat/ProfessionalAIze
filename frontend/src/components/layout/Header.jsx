import { AppBar, Toolbar, Typography, Box } from "@mui/material";

export default function Header() {
  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            ProfessionalAIze
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
