// Options page script for ProfessionalAIze Chrome Extension

document.addEventListener("DOMContentLoaded", function () {
  const apiKeyInput = document.getElementById("apiKey");
  const saveBtn = document.getElementById("saveBtn");
  const status = document.getElementById("status");

  // Load saved API key
  chrome.storage.sync.get(["geminiApiKey"], function (result) {
    if (result.geminiApiKey) {
      apiKeyInput.value = result.geminiApiKey;
    }
  });

  // Save API key
  saveBtn.addEventListener("click", function () {
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
      status.innerHTML =
        '<span style="color: #f44336;">❌ Please enter an API key</span>';
      return;
    }

    // Validate API key format (basic check)
    if (!apiKey.startsWith("AIza") || apiKey.length < 20) {
      status.innerHTML =
        '<span style="color: #f44336;">❌ Invalid API key format</span>';
      return;
    }

    // Save to Chrome storage
    chrome.storage.sync.set(
      {
        geminiApiKey: apiKey,
      },
      function () {
        status.innerHTML =
          '<span class="success">✅ API key saved successfully!</span>';

        // Clear status after 3 seconds
        setTimeout(() => {
          status.innerHTML = "";
        }, 3000);
      }
    );
  });

  // Save on Enter key
  apiKeyInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      saveBtn.click();
    }
  });
});
