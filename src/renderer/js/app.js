import { TabManager } from './modules/tabs.js';
import { FileManager } from './modules/files.js';
import { MarkdownRenderer } from './modules/markdown.js';
import { ThemeManager } from './modules/theme.js';
import { TOCManager } from './modules/toc.js';

class MiraDo {
  constructor() {
    this.tabManager = new TabManager();
    this.fileManager = new FileManager();
    this.markdownRenderer = new MarkdownRenderer();
    this.themeManager = new ThemeManager();
    this.tocManager = new TOCManager();

    this.currentFilePath = null;

    this.init();
  }

  async init() {
    this.detectPlatform();
    this.setupWindowControls();
    this.setupEventListeners();
    await this.loadRecentFiles();
    this.tocManager.hideButton();
    this.showHome();
  }

  detectPlatform() {
    const isMac = window.electronAPI.getPlatform() === 'darwin';
    if (isMac) {
      document.body.classList.add('is-mac');
    }
  }

  setupWindowControls() {
    // Using native OS window controls
  }

  setupEventListeners() {
    document.getElementById('open-file-btn').addEventListener('click', () => {
      this.openFile();
    });

    document.getElementById('theme-toggle-btn').addEventListener('click', () => {
      this.themeManager.toggle();
    });

    document.getElementById('toc-toggle-btn').addEventListener('click', () => {
      this.tocManager.show();
    });

    document.getElementById('toc-close-btn').addEventListener('click', () => {
      this.tocManager.hide();
    });

    this.tabManager.on('tabChanged', (tabId) => {
      this.handleTabChange(tabId);
    });

    this.tabManager.on('tabClosed', (tabId) => {
      this.handleTabClose(tabId);
    });

    this.setupKeyboardShortcuts();
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key === 'o') {
        e.preventDefault();
        this.openFile();
      }

      if (cmdOrCtrl && e.key === 'w') {
        e.preventDefault();
        const activeTabId = this.tabManager.getActiveTabId();
        if (activeTabId) {
          this.tabManager.closeTab(activeTabId);
        }
      }

      if (cmdOrCtrl && e.key === 't') {
        e.preventDefault();
        this.themeManager.toggle();
      }

      if (cmdOrCtrl && e.key === 'b') {
        e.preventDefault();
        if (this.currentFilePath) {
          if (this.tocManager.isVisible) {
            this.tocManager.hide();
          } else {
            this.tocManager.show();
          }
        }
      }
    });
  }

  async loadRecentFiles() {
    const recentFiles = await window.electronAPI.getRecentFiles();
    this.displayRecentFiles(recentFiles);
  }

  displayRecentFiles(files) {
    const listElement = document.getElementById('recent-files-list');
    
    if (files.length === 0) {
      listElement.innerHTML = '<div class="empty-recent">No recent files</div>';
      return;
    }

    listElement.innerHTML = files.map(filePath => {
      const fileName = filePath.split('/').pop();
      return `
        <div class="recent-file-item" data-path="${filePath}">
          <div class="recent-file-name">${fileName}</div>
          <div class="recent-file-path">${filePath}</div>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.recent-file-item').forEach(item => {
      item.addEventListener('click', () => {
        const filePath = item.dataset.path;
        this.openFileByPath(filePath);
      });
    });
  }

  async openFile() {
    const filePath = await window.electronAPI.openFile();
    if (filePath) {
      await this.openFileByPath(filePath);
    }
  }

  async openFileByPath(filePath) {
    const existingTab = this.tabManager.findTabByPath(filePath);
    if (existingTab) {
      this.tabManager.setActiveTab(existingTab.id);
      return;
    }

    const result = await window.electronAPI.readFile(filePath);
    if (result.success) {
      const fileName = filePath.split('/').pop();
      const tabId = this.tabManager.addTab(fileName, filePath);
      this.fileManager.addFile(tabId, filePath, result.content);
      this.tabManager.setActiveTab(tabId);
      await this.loadRecentFiles();
    } else {
      alert(`Failed to open file: ${result.error}`);
    }
  }

  handleTabChange(tabId) {
    if (tabId === 'home') {
      this.showHome();
    } else {
      const fileData = this.fileManager.getFile(tabId);
      if (fileData) {
        this.showMarkdown(fileData.content);
        this.currentFilePath = fileData.path;
        this.updateTitle(fileData.path);
      }
    }
  }

  updateTitle(filePath) {
    if (filePath) {
      window.electronAPI.setWindowTitle(filePath);
    } else {
      window.electronAPI.setWindowTitle(null);
    }
  }

  handleTabClose(tabId) {
    this.fileManager.removeFile(tabId);
    if (this.tabManager.getActiveTabId() === null) {
      this.showHome();
    }
  }

  showHome() {
    document.body.classList.add('viewing-home');
    document.getElementById('home-screen').style.display = 'flex';
    document.getElementById('viewer-container').style.display = 'none';
    this.tocManager.hideButton();
    this.tocManager.hide();
    this.currentFilePath = null;
    this.updateTitle(null);
  }

  showMarkdown(content) {
    document.body.classList.remove('viewing-home');
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('viewer-container').style.display = 'block';
    
    const html = this.markdownRenderer.render(content);
    document.getElementById('markdown-content').innerHTML = html;
    
    this.tocManager.generateTOC();
    this.tocManager.show();
  }
}

new MiraDo();
