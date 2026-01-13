export class MarkdownRenderer {
  constructor() {
    this.markedLoaded = false;
    this.loadMarked();
  }

  loadMarked() {
    if (typeof marked !== 'undefined') {
      this.setupMarked();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/marked@11.1.1/marked.min.js';
    script.onload = () => {
      this.setupMarked();
    };
    document.head.appendChild(script);
  }

  setupMarked() {
    this.markedLoaded = true;
    marked.setOptions({
      gfm: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false
    });

    const renderer = new marked.Renderer();
    const originalHeading = renderer.heading.bind(renderer);
    
    renderer.heading = function(text, level, raw) {
      const id = raw.toLowerCase().replace(/[^\w]+/g, '-');
      return `<h${level} id="${id}">${text}</h${level}>`;
    };

    marked.use({ renderer });
  }

  render(markdown) {
    if (!this.markedLoaded) {
      return '<p>Loading markdown renderer...</p>';
    }
    const html = marked.parse(markdown);
    
    setTimeout(() => {
      if (typeof hljs !== 'undefined') {
        document.querySelectorAll('pre code').forEach((block) => {
          hljs.highlightElement(block);
        });
      }
    }, 0);
    
    return html;
  }
}
