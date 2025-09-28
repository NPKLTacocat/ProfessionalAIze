# ProfessionalAIze 🚀

> Transform your casual text into professional, recruiter-friendly language using AI

You will need ProfessionalAIze because sometimes "yo, gimme dat job" needs to become "Dear Hiring Manager, I am writing to express my interest…"

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue.svg)](https://chrome.google.com/webstore)

## 🌟 Features

- **AI-Powered Text Transformation**: Uses Google Gemini AI to rewrite casual text in professional tone
- **Multiple Tone Options**: Choose from Professional, Casual, Friendly, Formal, Humorous, or create custom tones
- **Context Menu Integration**: Right-click on selected text anywhere in your browser to instantly professionalAIze it
- **Example-Based Formatting**: Provide example text to match specific writing styles
- **Real-time Processing**: Get instant results with a sleek, responsive interface
- **Secure Storage**: API keys stored locally in your browser
- **Cross-Platform**: Works on any Chromium-based browser

## 🛠️ Tech Stack

### Frontend (Chrome Extension)
- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **UI Components**: Material-UI (MUI) 7.3.2
- **Icons**: Material-UI Icons
- **Styling**: Emotion (CSS-in-JS)
- **AI Integration**: Google Generative AI SDK
- **Extension API**: Chrome Extension Manifest V3

### Backend (In Development)
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT with bcrypt

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **Google Gemini API Key** ([Get it here](https://makersuite.google.com/app/apikey))
- **Chrome/Chromium browser** for testing

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/NPKLTacocat/ProfessionalAIze.git
cd ProfessionalAIze
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Return to root directory
cd ..
```

### 3. Build the Extension

```bash
cd frontend
npm run build:extension
```

**Windows Users**: You can alternatively use the batch file:
```cmd
cd frontend
build-extension.bat
```

### 4. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `frontend/dist` folder
5. The extension should now appear in your Chrome toolbar

### 5. Configure API Key

1. Right-click the extension icon and select "Options"
2. Enter your Google Gemini API key
3. Save the settings

## 💻 Development Setup

### Frontend Development

```bash
cd frontend

# Start development server (for web preview)
npm run dev

# Build for production
npm run build

# Build with extension files
npm run build:extension

```

### Project Structure

```
ProfessionalAIze/
├── frontend/                 # Chrome extension source
│   ├── src/                 # React app source
│   │   ├── App.jsx         # Main popup component
│   │   ├── main.jsx        # React entry point
│   │   └── components/     # Reusable components
│   ├── public/             # Extension assets
│   │   ├── manifest.json   # Extension manifest
│   │   ├── background.js   # Service worker
│   │   ├── options.html    # Options page
│   │   └── icons/         # Extension icons
│   ├── dist/              # Built extension (after build)
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
├── backend/               # API server (in development)
├── LICENSE               # MIT License
└── README.md            # This file
```

## 🎯 Usage

### Using the Popup

1. Click the ProfessionalAIze icon in your Chrome toolbar
2. Paste or type your casual text in the input field
3. Optionally provide an example text for specific formatting
4. Select your desired tone (Professional, Casual, etc.) or manually add your custom tones
5. Click "Send" to transform your text
6. Copy the professionalAIze output

### Using Context Menu

1. Select any text on a webpage
2. Right-click and choose "ProfessionalAIze Selected Text"
3. The extension popup will open with your text pre-filled
4. Follow the popup usage steps above

## 🔧 Configuration

### API Key Setup

1. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Open extension options (right-click extension icon → Options)
3. Enter your API key and save

### Custom Tones

You can create custom tones by:
1. Typing a new tone name in the tone selector
2. Confirming the custom tone in the popup dialog window
3. The tone will be saved for future use

## 🚧 Roadmap & TODO

### Backend Development (In Progress)
- [ ] Complete Express.js API server setup
- [ ] Implement user authentication system
- [ ] Add PostgreSQL database integration
- [ ] Create user profile management
- [ ] Add text processing history
- [ ] Implement rate limiting and usage analytics

### Future Enhancements
- [ ] Firefox extension support
- [ ] Multiple AI provider support (OpenAI, Claude)
- [ ] Batch text processing
- [ ] Text templates and presets
- [ ] Integration with writing platforms (Gmail, LinkedIn, etc.)
- [ ] Team collaboration features

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/yourusername/ProfessionalAIze.git`
3. **Create** a feature branch: `git checkout -b feature/amazing-feature`
4. **Make** your changes
5. **Test** thoroughly
6. **Commit** with a clear message: `git commit -m 'Add amazing feature'`
7. **Push** to your branch: `git push origin feature/amazing-feature`
8. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Test your changes with the extension loaded
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/NPKLTacocat/ProfessionalAIze/issues)
- **Discussions**: [GitHub Discussions](https://github.com/NPKLTacocat/ProfessionalAIze/discussions)

---

**Made with ❤️ by:**
- [Khang Tran](https://github.com/NPKLTacocat)
- [Jose Colina Araque](https://github.com/RealShoheiOhtani)
- [Gabe](https://github.com/GabeHasAGit)
