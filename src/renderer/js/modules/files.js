export class FileManager {
  constructor() {
    this.files = new Map();
  }

  addFile(tabId, path, content) {
    this.files.set(tabId, { path, content });
  }

  getFile(tabId) {
    return this.files.get(tabId);
  }

  removeFile(tabId) {
    this.files.delete(tabId);
  }

  hasFile(tabId) {
    return this.files.has(tabId);
  }
}
