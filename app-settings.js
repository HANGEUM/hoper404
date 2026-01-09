const AppSettings = {
  defaults: {
    darkMode: true,
    autoUpdate: true,
    confirmDownload: true
  },

  keys() {
    return Object.keys(this.defaults);
  },

  get(key) {
    const value = localStorage.getItem(key);
    return value === null ? this.defaults[key] : value === "true";
  },

  set(key, value) {
    localStorage.setItem(key, value);
    this.apply();
  },

  apply() {
    document.body.classList.toggle("dark", this.get("darkMode"));
  },

  init() {
    this.apply();
  },

  /* ===== 설정 동기화 ===== */

  export() {
    const data = {};
    this.keys().forEach(k => {
      data[k] = this.get(k);
    });
    return JSON.stringify(data, null, 2);
  },

  import(json) {
    try {
      const data = JSON.parse(json);
      this.keys().forEach(k => {
        if (k in data) {
          localStorage.setItem(k, data[k]);
        }
      });
      this.apply();
      return true;
    } catch {
      return false;
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  AppSettings.init();
});
