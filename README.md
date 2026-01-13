# MiraDo

A minimalist Markdown viewer for desktop (Windows, Linux, macOS).

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

- 📑 **Tab Management** - Open and manage multiple Markdown files
- 🎨 **Dark/Light Theme Support** - Dark and light modes with native OS titlebar sync
- 📚 **Table of Contents** - Auto-generated, collapsible navigation
- ⚡ **Fast & Lightweight** - Built with Electron and vanilla JavaScript
- 🔄 **Recent Files** - Quick access to recently opened files
- ⌨️ **Keyboard Shortcuts** - Efficient navigation

## Installation

### Prerequisites

- Node.js 16 or higher

### Quick Start

```bash
# Install dependencies
npm install

# Run the app
npm start

# Or run in development mode
npm run dev
```

### Build

```bash
# Build for current platform
npm run build

# Platform-specific builds
npm run build:mac     # macOS
npm run build:win     # Windows
npm run build:linux   # Linux
```

Built applications will be in the `dist/` directory.

## Usage

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + O` | Open file |
| `Ctrl/Cmd + W` | Close current tab |
| `Ctrl/Cmd + T` | Toggle theme (dark/light) |
| `Ctrl/Cmd + B` | Toggle table of contents |

## Tech Stack

- [Electron](https://www.electronjs.org/) - Desktop application framework
- [marked.js](https://marked.js.org/) - Markdown parser
- [highlight.js](https://highlightjs.org/) - Syntax highlighting
- Vanilla JavaScript (ES6+ modules)
- CSS3 with custom properties

## Project Structure

```
mirado/
├── src/
│   ├── main/              # Electron main process
│   │   ├── main.js        # Application entry point
│   │   └── preload.js     # IPC bridge
│   └── renderer/          # Renderer process (UI)
│       ├── index.html     # Main HTML
│       ├── js/            # JavaScript modules
│       └── styles/        # CSS stylesheets
├── package.json           # Dependencies and scripts
├── example.md             # Example Markdown file
└── README.md              # This file
```

## Contributing

Contributions are welcome!

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

**Tran Minh Hieu**

## Acknowledgments

- Inspired by minimalist design
- Built with the amazing Electron framework
- Markdown parsing by marked.js
- Syntax highlighting by highlight.js

---

**Star ⭐ this repo if you find it useful!**
