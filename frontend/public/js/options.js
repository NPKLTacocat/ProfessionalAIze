/**
 * ProfessionalAIze Chrome Extension - Options Page
 * Handles API key management for the extension
 */

class OptionsManager {
  constructor() {
    this.apiKeyInput = null;
    this.saveBtn = null;
    this.removeBtn = null;
    this.status = null;
    this.form = null;

    // Constants
    this.API_KEY_MIN_LENGTH = 20;
    this.API_KEY_PREFIX = "AIza";
    this.STORAGE_KEY = "geminiApiKey";
    this.STATUS_TIMEOUT = 3000;

    this.init();
  }

  /**
   * Initialize the options page
   */
  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.initElements();
      this.bindEvents();
      this.loadSavedApiKey();
    });
  }

  /**
   * Initialize DOM elements
   */
  initElements() {
    this.apiKeyInput = document.getElementById("apiKey");
    this.saveBtn = document.getElementById("saveBtn");
    this.removeBtn = document.getElementById("removeBtn");
    this.status = document.getElementById("status");
    this.form = document.getElementById("settingsForm");

    if (
      !this.apiKeyInput ||
      !this.saveBtn ||
      !this.removeBtn ||
      !this.status ||
      !this.form
    ) {
      console.error("Required DOM elements not found");
      this.showStatus("Error: Page elements not loaded correctly", "error");
    }
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Form submission
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSave();
    });

    // Remove button
    this.removeBtn.addEventListener("click", () => {
      this.handleRemove();
    });

    // Input validation on blur
    this.apiKeyInput.addEventListener("blur", () => {
      this.validateApiKey();
    });

    // Clear status on input
    this.apiKeyInput.addEventListener("input", () => {
      this.clearStatus();
    });
  }

  /**
   * Load saved API key from Chrome storage
   */
  loadSavedApiKey() {
    if (!chrome?.storage?.sync) {
      console.warn("Chrome storage API not available");
      return;
    }

    chrome.storage.sync.get([this.STORAGE_KEY], (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error loading API key:", chrome.runtime.lastError);
        this.showStatus("Error loading saved settings", "error");
        return;
      }

      if (result[this.STORAGE_KEY]) {
        this.apiKeyInput.value = result[this.STORAGE_KEY];
      }
    });
  }

  /**
   * Handle save button click
   */
  handleSave() {
    const apiKey = this.apiKeyInput.value.trim();

    // Clear previous status
    this.clearStatus();

    // Validate input
    if (!apiKey) {
      this.showStatus("Please enter an API key", "error");
      this.apiKeyInput.focus();
      return;
    }

    if (!this.isValidApiKey(apiKey)) {
      this.showStatus(
        "Invalid API key format. Please check your API key.",
        "error"
      );
      this.apiKeyInput.focus();
      return;
    }

    // Save to Chrome storage
    this.saveApiKey(apiKey);
  }

  /**
   * Handle remove button click
   */
  handleRemove() {
    const confirmMessage = `⚠️ Are you sure you want to remove the API key?

This will disable the extension until you enter a new API key.`;

    if (!confirm(confirmMessage)) {
      return;
    }

    this.removeApiKey();
  }

  /**
   * Validate API key format
   */
  validateApiKey() {
    const apiKey = this.apiKeyInput.value.trim();

    if (apiKey && !this.isValidApiKey(apiKey)) {
      this.showStatus("Invalid API key format", "error");
      return false;
    }

    this.clearStatus();
    return true;
  }

  /**
   * Check if API key format is valid
   * @param {string} apiKey - The API key to validate
   * @returns {boolean} - Whether the API key is valid
   */
  isValidApiKey(apiKey) {
    return (
      apiKey.startsWith(this.API_KEY_PREFIX) &&
      apiKey.length >= this.API_KEY_MIN_LENGTH
    );
  }

  /**
   * Save API key to Chrome storage
   * @param {string} apiKey - The API key to save
   */
  saveApiKey(apiKey) {
    if (!chrome?.storage?.sync) {
      this.showStatus("Chrome storage not available", "error");
      return;
    }

    // Disable form while saving
    this.setFormDisabled(true);

    chrome.storage.sync.set({ [this.STORAGE_KEY]: apiKey }, () => {
      this.setFormDisabled(false);

      if (chrome.runtime.lastError) {
        console.error("Error saving API key:", chrome.runtime.lastError);
        this.showStatus("Error saving API key. Please try again.", "error");
        return;
      }

      this.showStatus("API key saved successfully!", "success");
      console.log("API key saved successfully");
    });
  }

  /**
   * Remove API key from Chrome storage
   */
  removeApiKey() {
    if (!chrome?.storage?.sync) {
      this.showStatus("Chrome storage not available", "error");
      return;
    }

    // Disable form while removing
    this.setFormDisabled(true);

    chrome.storage.sync.remove(this.STORAGE_KEY, () => {
      this.setFormDisabled(false);

      if (chrome.runtime.lastError) {
        console.error("Error removing API key:", chrome.runtime.lastError);
        this.showStatus("Error removing API key. Please try again.", "error");
        return;
      }

      this.apiKeyInput.value = "";
      this.showStatus("API key removed successfully!", "success");
      console.log("API key removed successfully");
    });
  }

  /**
   * Show status message
   * @param {string} message - The message to show
   * @param {string} type - The type of message ('success' or 'error')
   */
  showStatus(message, type) {
    if (!this.status) return;

    const icon = type === "success" ? "✅" : "❌";
    this.status.innerHTML = `<span class="status-${type}">${icon} ${message}</span>`;
    this.status.style.display = "block";

    // Clear status after timeout
    setTimeout(() => {
      this.clearStatus();
    }, this.STATUS_TIMEOUT);
  }

  /**
   * Clear status message
   */
  clearStatus() {
    if (this.status) {
      this.status.innerHTML = "";
      this.status.style.display = "none";
    }
  }

  /**
   * Enable or disable form elements
   * @param {boolean} disabled - Whether to disable the form
   */
  setFormDisabled(disabled) {
    if (this.apiKeyInput) this.apiKeyInput.disabled = disabled;
    if (this.saveBtn) this.saveBtn.disabled = disabled;
    if (this.removeBtn) this.removeBtn.disabled = disabled;
  }
}

// Initialize the options manager
new OptionsManager();
