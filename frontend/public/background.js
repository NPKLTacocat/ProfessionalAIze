// Background script for ProfessionalAIze Chrome Extension

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "processText") {
    processTextWithGemini(request.text)
      .then((response) => sendResponse({ success: true, data: response }))
      .catch((error) => sendResponse({ success: false, error: error.message }));

    // Return true to indicate we'll respond asynchronously
    return true;
  }
});

async function processTextWithGemini(inputText) {
  try {
    // Get API key from storage
    const result = await chrome.storage.sync.get(["geminiApiKey"]);
    const apiKey = result.geminiApiKey;

    if (!apiKey) {
      throw new Error(
        "Gemini API key not found. Please set it in the extension options."
      );
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an AI assistant meant to refine users' prompts to make them sound formal and professional.
Don't change the contents of the sentence, just make it sound better and appealing to recruiters.
User message: "${inputText}"`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to process text");
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

// Install/update handler
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // Open options page on first install
    chrome.runtime.openOptionsPage();
  }
});
