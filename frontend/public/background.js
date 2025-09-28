// Background script for ProfessionalAIze Chrome Extension

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "processText") {
    let realExample;
    let realTone;

    if (!request.example == "") {
      realExample =
        ` and style it like in this example: "` + request.example + `"`;
    } else {
      realExample = request.example;
    }

    if (request.tone == "") {
      realTone = "Professional";
    } else {
      realTone = request.tone;
    }
    processTextWithGemini(request.text, realExample, realTone)
      .then((response) => sendResponse({ success: true, data: response }))
      .catch((error) => sendResponse({ success: false, error: error.message }));

    // Return true to indicate we'll respond asynchronously
    return true;
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "SelectedText" && info.selectionText) {
    const selectedText = info.selectionText;

    chrome.windows.create(
      {
        url: chrome.runtime.getURL("index.html"),
        type: "popup",
        width: 400,
        height: 600,
      },
      (newWindow) => {
        // Wait until popup loads, then send selected text
        chrome.runtime.onConnect.addListener(function portListener(port) {
          if (port.name === "popupReady") {
            port.postMessage({ action: "prefillText", text: selectedText });
            chrome.runtime.onConnect.removeListener(portListener);
          }
        });
      }
    );
  }
});



async function processTextWithGemini(inputText, example, tone) {
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
                        to rewrite a given prompt. Dont change the contents of the sentence, just take this prompt: "${inputText}" ${example} and in the a tone of: "${tone}". Replicate typing style, and any other
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
    console.log("Gemini response data:", data.candidates[0].content.parts[0].text);
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
  chrome.contextMenus.create({
    id: "SelectedText",
    title: "ProfessionalAIze Selected Text",
    contexts: ["selection"],
  });
});
