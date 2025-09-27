import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Paper,
  Box,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Send as SendIcon, AutoAwesome as AIIcon } from "@mui/icons-material";
import { Layout } from "./components";
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    const text = event.target.value;
    setInputText(text);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setOutputText(""); // Clear previous output

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const aiPrompt = `
      You are an AI assistant meant to refine users' prompts to make them sound formal and professional.
      Don't change the contents of the sentence, just make it sound better and appealing to recruiters.
      User message: "${inputText}"
      `;

      const result = await model.generateContent(aiPrompt);
      const responseText = result.response.text();

      setOutputText(responseText);
    } catch (err) {
      console.error("Gemini API Error:", err);
      setOutputText(
        "Error: Failed to generate response. Please check your API key and try again."
      );
    } finally {
      setIsLoading(false);
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
                placeholder="Enter your text to make it sound more professional... (Ctrl+Enter to send)"
                value={inputText}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
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
                endIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SendIcon />
                  )
                }
                onClick={handleSend}
                disabled={!inputText.trim() || isLoading}
                sx={{
                  minWidth: "120px",
                  position: "relative",
                }}
              >
                {isLoading ? "Processing..." : "Send"}
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
              Professional Output
              <AIIcon
                sx={{ ml: 1, verticalAlign: "middle", fontSize: "1.2rem" }}
              />
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
                  fontStyle: outputText ? "normal" : "italic",
                  lineHeight: 1.6,
                }}
              >
                {isLoading
                  ? "✨ AI is making your text more professional..."
                  : outputText ||
                    "Your professionally refined text will appear here..."}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Layout>
  );
}

export default App;
