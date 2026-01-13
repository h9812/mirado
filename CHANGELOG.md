# Changelog

All notable changes to MiraDo will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-13

### Added
- Initial release of MiraDo
- Multiple file support with tab interface
- Dark and light theme with native OS titlebar sync (macOS)
- Auto-generated Table of Contents with collapse/expand functionality
- Recent files tracking (max 10, display 3 with scrollbar)
- Keyboard shortcuts for common actions
- GitHub Flavored Markdown support
- Syntax highlighting for code blocks (highlight.js)
- Smooth scrolling and active section highlighting
- Minimalist UI inspired by VSCode
- Cross-platform support (Windows, Linux, macOS)

### Features
- **Tabs**: Home tab + file tabs with close buttons
- **TOC**: Collapsible tree structure with navigation
- **Theme**: Toggle with icon, persistent preference
- **Recent Files**: Quick access from home screen
- **Native Controls**: OS-native window controls
- **Markdown**: Tables, lists, code blocks, images, links

### Technical
- Electron 28.1.0
- marked.js 11.1.1 for Markdown parsing
- highlight.js 11.9.0 for syntax highlighting
- Vanilla JavaScript with ES6+ modules
- CSS custom properties for theming
- Context-isolated IPC communication

---

## [Unreleased]

### Planned
- File watching and auto-reload
- Search within document
- Print support
- Export to PDF
- Custom keyboard shortcuts
- Math equation support (KaTeX)
- Mermaid diagram support

---

For the full version history, see [GitHub Releases](https://github.com/h9812/mirado/releases).
