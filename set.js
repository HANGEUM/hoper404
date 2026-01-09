const settings = {
  darkMode: document.getElementById("darkMode"),
  autoUpdate: document.getElementById("autoUpdate"),
  confirmDownload: document.getElementById("confirmDownload")
};

function loadSettings() {
  Object.keys(settings).forEach(key => {
    settings[key].checked = localStorage.getItem(key) === "true";
  });

  applyTheme();
}

function saveSettings() {
  Object.keys(settings).forEach(key => {
    localStorage.setItem(key, settings[key].checked);
  });
}

function applyTheme() {
  document.body.classList.toggle(
    "dark",
    settings.darkMode.checked
  );
}

Object.values(settings).forEach(input => {
  input.addEventListener("change", () => {
    saveSettings();
    applyTheme();
  });
});

function resetData() {
  if (confirm("All settings and data will be reset. Are you sure?")) {
    localStorage.clear();
    location.reload();
  }
}

function goHome() {
  location.href = "index.html";
}

loadSettings();

function exportSettings() {
  const data = AppSettings.export();
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "downloadgame-settings.json";
  a.click();

  URL.revokeObjectURL(url);
}

function importSettings() {
  document.getElementById("importFile").click();
}

document.getElementById("importFile").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    if (AppSettings.import(reader.result)) {
      alert("성공적으로 설정을 불러왔습니다! - Settings synchronized successfully!");
      location.reload();
    } else {
      alert("설정 파일이 올바르지 않습니다. - Invalid settings file.");
    }
  };
  reader.readAsText(file);
});

function openTab(name, btn) {
  document.querySelectorAll(".tab-page").forEach(tab => {
    tab.classList.remove("active");
  });

  document.getElementById(`tab-${name}`).classList.add("active");

  document.querySelectorAll(".floating-tabs button").forEach(b => {
    b.classList.remove("active");
  });

  btn.classList.add("active");
}

function searchSettings(keyword) {
  keyword = keyword.trim().toLowerCase();

  let foundAny = false;

  document.querySelectorAll(".tab-page").forEach(tab => {
    let tabHasResult = false;

    tab.querySelectorAll(".setting-item").forEach(item => {
      const keys = item.dataset.keywords || "";
      const match = keys.toLowerCase().includes(keyword);

      item.style.display = match || keyword === "" ? "flex" : "none";

      if (match) tabHasResult = true;
    });

    // 검색 결과 있는 탭만 표시
    tab.style.display =
      tabHasResult || keyword === "" ? "block" : "none";

    if (tabHasResult && !foundAny) {
      // 첫 결과 탭 자동 활성화
      document.querySelectorAll(".tab-page").forEach(t =>
        t.classList.remove("active")
      );
      tab.classList.add("active");
      foundAny = true;
    }
  });

  // 검색어 없으면 기본 탭 복원
  if (keyword === "") {
    resetTabs();
  }
}

function resetTabs() {
  document.querySelectorAll(".tab-page").forEach(tab => {
    tab.style.display = "none";
    tab.classList.remove("active");
  });

  document.getElementById("tab-general").style.display = "block";
  document.getElementById("tab-general").classList.add("active");
}

const SEARCH_HISTORY_KEY = "setting_search_history";
const MAX_HISTORY = 5;

function getSearchHistory() {
  return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || "[]");
}

function saveSearchHistory(keyword) {
  if (!keyword) return;

  let history = getSearchHistory();

  // 중복 제거
  history = history.filter(k => k !== keyword);

  history.unshift(keyword);

  if (history.length > MAX_HISTORY) {
    history.length = MAX_HISTORY;
  }

  localStorage.setItem(
    SEARCH_HISTORY_KEY,
    JSON.stringify(history)
  );
}

function showSearchHistory() {
  const historyBox = document.getElementById("searchHistory");
  const history = getSearchHistory();

  if (history.length === 0) {
    historyBox.classList.add("hidden");
    return;
  }

  historyBox.innerHTML = history
    .map(
      k => `<div onclick="selectHistory('${k}')">${k}</div>`
    )
    .join("");

  historyBox.classList.remove("hidden");
}

function selectHistory(keyword) {
  const input = document.getElementById("settingSearch");
  input.value = keyword;
  searchSettings(keyword);
  hideSearchHistory();
}

function hideSearchHistory() {
  document
    .getElementById("searchHistory")
    .classList.add("hidden");
}

// 검색 실행 시 히스토리 저장
const originalSearchSettings = searchSettings;
searchSettings = function (keyword) {
  originalSearchSettings(keyword);
  saveSearchHistory(keyword.trim());
};

function clearSearchHistory() {
  if (!confirm("search history clear?")) return;

  localStorage.removeItem(SEARCH_HISTORY_KEY);

  const historyBox = document.getElementById("searchHistory");
  historyBox.innerHTML = "";
  historyBox.classList.add("hidden");
}

const FAVORITE_KEY = "setting_favorites";

function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITE_KEY) || "[]");
}

function toggleFavorite(id) {
  let favs = getFavorites();

  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }

  localStorage.setItem(FAVORITE_KEY, JSON.stringify(favs));
  renderFavorites();
  updateFavoriteIcons();
}

function updateFavoriteIcons() {
  const favs = getFavorites();

  document.querySelectorAll(".setting-item").forEach(item => {
    const id = item.dataset.id;
    const btn = item.querySelector(".fav-btn");

    if (!btn) return;

    btn.textContent = favs.includes(id) ? "★" : "☆";
  });
}

function renderFavorites() {
  const favs = getFavorites();
  const list = document.getElementById("favoriteList");

  if (!list) return;

  list.innerHTML = "";

  if (favs.length === 0) {
    list.innerHTML = "<p>즐겨찾기한 설정이 없습니다.</p>";
    return;
  }

  favs.forEach(id => {
    const item = document.querySelector(`.setting-item[data-id="${id}"]`);
    if (item) {
      list.appendChild(item.cloneNode(true));
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateFavoriteIcons();
  renderFavorites();
});

function toggleSettingByArea(area) {
  const checkbox = area.querySelector("input[type='checkbox']");
  if (!checkbox) return;

  checkbox.checked = !checkbox.checked;

  checkbox.dispatchEvent(new Event("change")); // !!!wow!!!
}

let pressTimer = null;
let longPressTriggered = false;

const LONG_PRESS_TIME = 600; // ms

function startPress(event, element) {
  longPressTriggered = false;

  pressTimer = setTimeout(() => {
    longPressTriggered = true;
    openSettingDetail(element.closest(".setting-item").dataset.id);
  }, LONG_PRESS_TIME);
}

function endPress() {
  clearTimeout(pressTimer);

  // 짧은 클릭일 때만 토글
  if (!longPressTriggered) {
    const main = event.currentTarget;
    toggleSettingByArea(main);
  }
}

function openSettingDetail(settingId) {
  location.href = `setting-detail.html?id=${settingId}`;
}

Object.keys(SETTINGS).forEach(key => {
  const iconEl = document.getElementById("icon-" + key);
  if (iconEl) {
    iconEl.textContent = SETTINGS[key].icon;
  }
});
