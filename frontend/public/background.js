// Background script for ProfessionalAIze Chrome Extension

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "processText") {
    let realExample;

    if (request.example == "") {
      realExample = `We remain committed to delivering innovative solutions that align 
                     with our clients’ strategic objectives while maintaining the highest 
                     standards of integrity and excellence.`
    } else {
      realExample = request.example;
    }
    
    processTextWithGemini(request.text, realExample)
      .then((response) => sendResponse({ success: true, data: response }))
      .catch((error) => sendResponse({ success: false, error: error.message }));

    // Return true to indicate we'll respond asynchronously
    return true;
  }
});


async function processTextWithGemini(inputText, example) {
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
                  text: `you are ai assistant meant to refine users' prompts to replicate the format of a given example
                        to rewrite a given prompt. Dont change the contents of the sentence, just take this prompt: "${inputText}" 
                        and style it like in this example: "${example}". Replicate both tone, typing style, and any other
                        factors to make it seem like the new message was written by the same person who wrote the example.  
                        Do not include anything in your response but the new message replicating the example's style.`,

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
