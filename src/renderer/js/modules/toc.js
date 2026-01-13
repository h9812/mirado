export class TOCManager {
  constructor() {
    this.container = document.getElementById('toc-container');
    this.nav = document.getElementById('toc-nav');
    this.toggleBtn = document.getElementById('toc-toggle-btn');
    this.isVisible = false;
  }

  show() {
    this.container.style.display = 'flex';
    this.toggleBtn.style.display = 'none';
    this.isVisible = true;
  }

  hide() {
    this.container.style.display = 'none';
    this.toggleBtn.style.display = 'flex';
    this.isVisible = false;
  }

  showButton() {
    if (!this.isVisible) {
      this.toggleBtn.style.display = 'flex';
    }
  }

  hideButton() {
    this.toggleBtn.style.display = 'none';
  }

  generateTOC() {
    const content = document.getElementById('markdown-content');
    const headings = content.querySelectorAll('h1, h2, h3, h4');

    if (headings.length === 0) {
      this.nav.innerHTML = '<div class="empty-recent">No headings found</div>';
      return;
    }

    const tocStructure = this.buildTOCStructure(headings);
    this.nav.innerHTML = tocStructure;

    this.nav.querySelectorAll('.toc-item').forEach(item => {
      const text = item.textContent;
      item.setAttribute('title', text);
      
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.dataset.id;
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          this.setActiveItem(targetId);
        }
      });
    });

    this.nav.querySelectorAll('.toc-collapse-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const parent = btn.closest('.toc-group');
        parent.classList.toggle('collapsed');
      });
    });

    this.setupScrollSpy();
  }

  buildTOCStructure(headings) {
    const items = Array.from(headings);
    let html = '';
    let stack = [{ level: 0, children: [] }];

    items.forEach(heading => {
      const level = parseInt(heading.tagName.substring(1));
      const text = heading.textContent;
      const id = heading.id;

      while (stack.length > 1 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      const hasChildren = items.some(h => {
        const idx = items.indexOf(heading);
        const hIdx = items.indexOf(h);
        if (hIdx <= idx) return false;
        const nextSameLevel = items.slice(idx + 1).find(nh => parseInt(nh.tagName.substring(1)) <= level);
        if (nextSameLevel && items.indexOf(nextSameLevel) <= hIdx) return false;
        return parseInt(h.tagName.substring(1)) > level;
      });

      if (level === 1 || level === 2) {
        if (hasChildren) {
          html += `
            <div class="toc-group">
              <div class="toc-item-wrapper">
                <button class="toc-collapse-btn">
                  <svg width="8" height="8" viewBox="0 0 8 8">
                    <path d="M2 1 L6 4 L2 7" stroke="currentColor" stroke-width="1.5" fill="none"/>
                  </svg>
                </button>
                <a href="#${id}" class="toc-item level-${level}" data-id="${id}" title="${text}">${text}</a>
              </div>
              <div class="toc-children">
          `;
          stack.push({ level, hasChildren: true });
        } else {
          html += `
            <div class="toc-item-wrapper">
              <a href="#${id}" class="toc-item level-${level}" data-id="${id}" title="${text}" style="padding-left: ${(level - 1) * 8}px">${text}</a>
            </div>
          `;
        }
      } else {
        html += `
          <div class="toc-item-wrapper">
            <a href="#${id}" class="toc-item level-${level}" data-id="${id}" title="${text}" style="padding-left: ${(level - 1) * 8}px">${text}</a>
          </div>
        `;
      }
    });

    while (stack.length > 1) {
      if (stack[stack.length - 1].hasChildren) {
        html += '</div></div>';
      }
      stack.pop();
    }

    return html;
  }

  setupScrollSpy() {
    const content = document.getElementById('markdown-content');
    const headings = content.querySelectorAll('h1, h2, h3, h4');
    const viewer = document.getElementById('viewer-container');

    if (headings.length === 0) return;

    viewer.addEventListener('scroll', () => {
      let currentId = '';
      headings.forEach(heading => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          currentId = heading.id;
        }
      });

      if (currentId) {
        this.setActiveItem(currentId);
      }
    });
  }

  setActiveItem(id) {
    this.nav.querySelectorAll('.toc-item').forEach(item => {
      item.classList.remove('active');
    });

    const activeItem = this.nav.querySelector(`[data-id="${id}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
    }
  }
}
