export class TabManager {
  constructor() {
    this.tabs = new Map();
    this.activeTabId = 'home';
    this.tabIdCounter = 0;
    this.eventListeners = {
      tabChanged: [],
      tabClosed: []
    };

    this.container = document.getElementById('tabs-container');
    this.createHomeTab();
  }

  createHomeTab() {
    const homeTab = document.createElement('div');
    homeTab.className = 'tab home active';
    homeTab.dataset.tabId = 'home';
    homeTab.innerHTML = `
      <span class="tab-label">Home</span>
    `;
    homeTab.addEventListener('click', () => this.setActiveTab('home'));
    this.container.appendChild(homeTab);
    this.tabs.set('home', { id: 'home', label: 'Home', element: homeTab });
  }

  addTab(label, filePath) {
    const tabId = `tab-${++this.tabIdCounter}`;
    const tab = document.createElement('div');
    tab.className = 'tab';
    tab.dataset.tabId = tabId;
    tab.innerHTML = `
      <span class="tab-label" title="${filePath}">${label}</span>
      <button class="tab-close">
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M1 1 L11 11 M11 1 L1 11" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </button>
    `;

    tab.addEventListener('click', () => {
      this.setActiveTab(tabId);
    });

    tab.querySelector('.tab-close').addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeTab(tabId);
    });

    this.container.appendChild(tab);
    this.tabs.set(tabId, { id: tabId, label, path: filePath, element: tab });

    return tabId;
  }

  closeTab(tabId) {
    if (tabId === 'home') return;

    const tab = this.tabs.get(tabId);
    if (!tab) return;

    tab.element.remove();
    this.tabs.delete(tabId);

    this.emit('tabClosed', tabId);

    if (this.activeTabId === tabId) {
      const remainingTabs = Array.from(this.tabs.keys());
      const nextTabId = remainingTabs[remainingTabs.length - 1] || 'home';
      this.setActiveTab(nextTabId);
    }
  }

  setActiveTab(tabId) {
    if (this.activeTabId === tabId) return;

    this.tabs.forEach(tab => {
      tab.element.classList.remove('active');
    });

    const tab = this.tabs.get(tabId);
    if (tab) {
      tab.element.classList.add('active');
      this.activeTabId = tabId;
      this.emit('tabChanged', tabId);
    }
  }

  getActiveTabId() {
    return this.activeTabId === 'home' ? null : this.activeTabId;
  }

  findTabByPath(filePath) {
    for (const tab of this.tabs.values()) {
      if (tab.path === filePath) {
        return tab;
      }
    }
    return null;
  }

  on(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].push(callback);
    }
  }

  emit(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data));
    }
  }
}
