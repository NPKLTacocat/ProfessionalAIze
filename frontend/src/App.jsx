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
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  createFilterOptions,
} from "@mui/material";
import {
  Send as SendIcon,
  AutoAwesome as AIIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

function App() {
  const [inputText, setInputText] = useState("");
  const [exampleText, setExampleText] = useState("");
  const [toneText, setToneText] = useState(null);
  const [dialogText, setDialogText] = useState("");
  const [open, toggleOpen] = useState(false);
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyExists, setApiKeyExists] = useState(false);

  const filter = createFilterOptions();
  const options = ["Professional", "Casual", "Friendly", "Formal", "Humorous"];

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

  const handleClose = () => {
    setDialogText("");
    toggleOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setToneText(dialogText);
    handleClose();
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
      <Box
        sx={{
          p: 0.75,
          bgcolor: "primary.main",
          color: "white",
          paddingLeft: 2,
        }}
      >
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
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <Alert severity="warning" sx={{ m: 1, position: "absolute" }}>
            <Typography variant="body2">
              API key required. Click{" "}
              <Link onClick={openOptions} sx={{ cursor: "pointer" }}>
                Settings
              </Link>{" "}
              to configure.
            </Typography>
          </Alert>
        </Box>
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
              rows={2}
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

          {/* Prompt Selection and Send Button Bar */}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", p: 1, gap: 1 }}
          >
            <Autocomplete
              value={toneText}
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  // Only open dialog if it's NOT one of the predefined options
                  if (!options.includes(newValue)) {
                    setTimeout(() => {
                      toggleOpen(true);
                      setDialogText(newValue);
                    }, 0);
                  } else {
                    setToneText(newValue);
                  }
                } else if (newValue && newValue.inputValue) {
                  // Custom option selected
                  setTimeout(() => {
                    toggleOpen(true);
                    setDialogText(newValue.inputValue);
                  }, 0);
                } else {
                  setToneText(newValue);
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                if (
                  params.inputValue !== "" &&
                  !options.includes(params.inputValue)
                ) {
                  filtered.push({
                    inputValue: params.inputValue,
                    label: `Add "${params.inputValue}"`,
                  });
                }

                return filtered;
              }}
              id="tone-select"
              options={options}
              getOptionLabel={(option) => {
                if (typeof option === "string") {
                  return option;
                }
                if (option.inputValue) {
                  return option.inputValue;
                }
                return option;
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              renderOption={(props, option) => {
                const label =
                  typeof option === "string"
                    ? option
                    : option.label || option.inputValue;
                return <li {...props}>{label}</li>;
              }}
              sx={{ width: "150px" }}
              freeSolo
              renderInput={(params) => <TextField {...params} label="Tone" />}
            ></Autocomplete>
            <Dialog open={open} onClose={handleClose}>
              <form onSubmit={handleSubmit}>
                <DialogTitle>Specify Custom Tone</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please specify your custom tone:
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="tone"
                    value={dialogText}
                    onChange={(e) => setDialogText(e.target.value)}
                    label="Tone"
                    type="text"
                    variant="standard"
                  ></TextField>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button type="submit">OK</Button>
                </DialogActions>
              </form>
            </Dialog>

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
        </Paper>
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
