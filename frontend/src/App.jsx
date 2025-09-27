import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Paper,
  Box,
  Button,
  Divider,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { Layout } from "./components";

function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  const handleInputChange = (event) => {
    const text = event.target.value;
    setInputText(text);
  };

  const handleSend = () => {
    if (inputText.trim()) {
      // Process the input text (replace with your logic)
      setOutputText(`You sent: ${inputText}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      handleSend();
    }
  };

  return (
    <Layout>
      <Container
        maxWidth="md"
        sx={{
          height: "calc(100vh - 64px)", // Full height minus header
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          py: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          textAlign="center"
          gutterBottom
          sx={{ mb: 4 }}
        >
          ProfessionalAIze
        </Typography>

        <Box
          sx={{
            width: "100%",
            maxWidth: "800px",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            alignItems: "center",
          }}
        >
          {/* Input Box */}
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ p: 3, pb: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Input
              </Typography>

              <TextField
                multiline
                rows={8}
                variant="outlined"
                placeholder="Enter your text here... (Ctrl+Enter to send)"
                value={inputText}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    alignItems: "flex-start",
                  },
                }}
              />
            </Box>

            {/* Bottom Bar with Send Button */}
            <Divider />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                p: 2,
                backgroundColor: "background.default",
              }}
            >
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleSend}
                disabled={!inputText.trim()}
                sx={{
                  minWidth: "100px",
                }}
              >
                Send
              </Button>
            </Box>
          </Paper>

          {/* Output Box */}
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              minHeight: "300px",
              p: 3,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" gutterBottom color="secondary">
              Output
            </Typography>

            <Box
              sx={{
                flexGrow: 1,
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                p: 2,
                backgroundColor: "background.paper",
                overflow: "auto",
                minHeight: "200px",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  color: outputText ? "text.primary" : "text.secondary",
                }}
              >
                {outputText || "Your output will appear here..."}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Layout>
  );
}

export default App;
