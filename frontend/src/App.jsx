import { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Paper,
  Box,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Link,
} from "@mui/material";
import {
  Send as SendIcon,
  AutoAwesome as AIIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

function App() {
  const [inputText, setInputText] = useState("");

  const [exampleText, setExampleText] = useState("");

  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyExists, setApiKeyExists] = useState(false);

  // Check if API key exists on component mount
  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.sync.get(["geminiApiKey"], (result) => {
        setApiKeyExists(!!result.geminiApiKey);
      });
    }
  }, []);

  const handleInputChange = (event) => {
    const text = event.target.value;
    setInputText(text);
  };

  const handleExampleChange = (event) => {
    const text = event.target.value;
    setExampleText(text);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setOutputText("");

    try {
      // Use Chrome extension messaging to background script
      if (typeof chrome !== "undefined" && chrome.runtime) {
        chrome.runtime.sendMessage(
          { action: "processText", text: inputText, example: exampleText },

          (response) => {
            setIsLoading(false);
            if (response.success) {
              setOutputText(response.data);
            } else {
              setOutputText(`Error: ${response.error}`);
            }
          }
        );
      } else {
        // Fallback for development
        setOutputText(
          "Chrome extension API not available. This works only as a Chrome extension."
        );
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Extension Error:", err);
      setOutputText("Error: Failed to process text. Please try again.");
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      handleSend();
    }
  };

  const openOptions = () => {
    if (typeof chrome !== "undefined" && chrome.runtime) {
      chrome.runtime.openOptionsPage();
    }
  };

  return (
    <Box
      sx={{
        width: "400px",
        height: "600px",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            ProfessionalAIze
          </Typography>
          <Button
            size="small"
            onClick={openOptions}
            sx={{ color: "white", minWidth: "auto", p: 1 }}
          >
            <SettingsIcon fontSize="small" />
          </Button>
        </Box>
      </Box>

      {/* API Key Warning */}
      {!apiKeyExists && (
        <Alert severity="warning" sx={{ m: 1 }}>
          <Typography variant="body2">
            API key required. Click{" "}
            <Link onClick={openOptions} sx={{ cursor: "pointer" }}>
              Settings
            </Link>{" "}
            to configure.
          </Typography>
        </Alert>
      )}

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: 2,
          gap: 1.5,
          overflow: "auto",
        }}
      >
        {/* Example Box */}
        <Paper
          elevation={2}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Example Text
            </Typography>
            <TextField
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter example text for tone (optional, professional default)..."
              value={exampleText}
              onChange={handleExampleChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading || !apiKeyExists}
              size="small"
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  alignItems: "flex-start",
                },
              }}
            />
          </Box>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Input Text
            </Typography>
            <TextField
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter casual text to retone it..."
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading || !apiKeyExists}
              size="small"
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  alignItems: "flex-start",
                },
              }}
            />
          </Box>
        </Paper>

        {/* Send Button Bar */}
        <Divider />
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <Button
            variant="contained"
            size="small"
            endIcon={
              isLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SendIcon />
              )
            }
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading || !apiKeyExists}
            sx={{ minWidth: "80px" }}
          >
            {isLoading ? "..." : "Send"}
          </Button>
        </Box>

        {/* Output Box */}
        <Paper
          elevation={2}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: "150px",
          }}
        >
          <Box
            sx={{
              p: 2,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <Typography variant="subtitle2" color="secondary" gutterBottom>
              Formatted Output{" "}
              <AIIcon sx={{ fontSize: "1rem", verticalAlign: "middle" }} />
            </Typography>
            <Box
              sx={{
                flex: 1,
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                p: 1.5,
                backgroundColor: "background.paper",
                overflow: "auto",
                minHeight: 0,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  color: outputText ? "text.primary" : "text.secondary",
                  fontStyle: outputText ? "normal" : "italic",
                  lineHeight: 1.4,
                  fontSize: "0.875rem",
                }}
              >
                {isLoading
                  ? "✨ Making your text professional..."
                  : outputText || "Professional text will appear here..."}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default App;
