export class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    this.applyTheme(this.currentTheme);
    this.updateIcon();
    window.electronAPI.setTheme(this.currentTheme);
  }

  toggle() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(this.currentTheme);
    this.updateIcon();
    localStorage.setItem('theme', this.currentTheme);
    window.electronAPI.setTheme(this.currentTheme);
  }

  applyTheme(theme) {
    document.body.dataset.theme = theme;
    this.updateHighlightTheme(theme);
  }

  updateHighlightTheme(theme) {
    const highlightTheme = document.getElementById('highlight-theme');
    if (highlightTheme) {
      if (theme === 'dark') {
        highlightTheme.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css';
      } else {
        highlightTheme.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
      }
    }
  }

  updateIcon() {
    const sunIcon = document.querySelector('.theme-icon.sun');
    const moonIcon = document.querySelector('.theme-icon.moon');
    
    if (this.currentTheme === 'dark') {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    } else {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}
