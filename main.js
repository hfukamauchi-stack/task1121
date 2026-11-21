
const restaurants = [
  { id: 1, name: "Chin Chin Eating Place", area: "SMU周辺", category: "chicken", description: "ローカルに親しまれるチキンライス。" , lat: 1.298, lng: 103.850 },
  { id: 2, name: "Chatter Box", area: "Orchard", category: "chicken", description: "チキンライスの有名店。" , lat: 1.304, lng: 103.832 },
  { id: 3, name: "Tony Cafe", area: "SMU周辺", category: "rice", description: "ローカルな雰囲気の食堂。" , lat: 1.296, lng: 103.849 },
  { id: 4, name: "Bras Basah Complex", area: "Bras Basah", category: "rice", description: "いろいろなローカルフードを楽しめる。" , lat: 1.296, lng: 103.853 },
  { id: 5, name: "Thai Gold Food", area: "SMU周辺", category: "thai", description: "気軽に楽しめるタイ料理。" , lat: 1.297, lng: 103.851 },
  { id: 6, name: "The Siam Thai Kitchen", area: "Parklane", category: "thai", description: "タイの味を楽しめる一軒。" , lat: 1.298, lng: 103.852 },
  { id: 7, name: "A9", area: "SMU周辺", category: "noodle", description: "ローカルな麺料理。" , lat: 1.299, lng: 103.850 },
  { id: 8, name: "800 Bowls", area: "SMU周辺", category: "noodle", description: "気軽に立ち寄れる麺料理店。" , lat: 1.300, lng: 103.851 },
  { id: 9, name: "Janggut Laksa", area: "Roxy Square / Katong", category: "noodle", description: "カトンエリアのラクサ。" , lat: 1.303, lng: 103.905 },
  { id: 10, name: "1983", area: "SMU周辺", category: "noodle", description: "ローカルフードを楽しめる。" , lat: 1.298, lng: 103.849 },
  { id: 11, name: "3Meals a Day", area: "SMU周辺", category: "rice", description: "ソルテッドエッグ料理が楽しめる。" , lat: 1.297, lng: 103.850 },
  { id: 12, name: "Ng Kuan Chilli Pan Mee", area: "SMU周辺", category: "noodle", description: "チリパンミーの専門店。" , lat: 1.299, lng: 103.852 },
  { id: 13, name: "Song Fa Bak Kut Teh", area: "複数店舗", category: "other", description: "シンガポール名物バクテー。" , lat: 1.289, lng: 103.848 },
  { id: 14, name: "Ponggol Nasi Lemak", area: "SMU周辺", category: "rice", description: "ナシレマの人気店。" , lat: 1.300, lng: 103.850 },
  { id: 15, name: "The Long Weekend Pizza", area: "Katong", category: "other", description: "カトンエリアのピザ。" , lat: 1.305, lng: 103.904 },
  { id: 16, name: "Hillman Restaurant", area: "Little India", category: "chinese", description: "ペーパーチキンで知られる中華料理店。" , lat: 1.309, lng: 103.858 },
  { id: 17, name: "Beach Road Prawn Noodle", area: "Beach Road", category: "noodle", description: "エビの旨味が楽しめる麺料理。" , lat: 1.302, lng: 103.864 },
  { id: 18, name: "南北名厨", area: "Bugis", category: "chinese", description: "中華料理を楽しめる一軒。" , lat: 1.300, lng: 103.856 },
  { id: 19, name: "Zhang Ji Shanghai La Mian Xiao Long Bao", area: "Alexandra", category: "chinese", description: "小籠包や上海麺料理。" , lat: 1.287, lng: 103.805 },
  { id: 20, name: "なんじゃもんじゃ", area: "River Valley", category: "japanese", description: "日本の味が恋しくなったときに。" , lat: 1.294, lng: 103.836 },
  { id: 21, name: "Umai Artisanal Udon Bar", area: "Beach Road", category: "japanese", description: "こだわりのうどん。" , lat: 1.302, lng: 103.861 },
  { id: 22, name: "Ma Maison", area: "Bugis", category: "japanese", description: "洋食スタイルの日本食。" , lat: 1.300, lng: 103.855 },
  { id: 23, name: "Brother's Ramen", area: "Tanjong Pagar", category: "japanese", description: "ラーメンを楽しめる一軒。" , lat: 1.276, lng: 103.844 },
  { id: 24, name: "一家人", area: "SMU周辺", category: "sweets", description: "甘いものを楽しめるお店。" , lat: 1.298, lng: 103.850 },
  { id: 25, name: "Triplets", area: "SMU周辺", category: "sweets", description: "食後に立ち寄りたいスイーツ店。" , lat: 1.299, lng: 103.851 },
  { id: 26, name: "YY Kafei Dian", area: "Beach Road", category: "sweets", description: "ローカルなカフェでひと休み。" , lat: 1.302, lng: 103.862 }
];

const STORAGE_KEY = "singaporeInfantryData";

let currentCategory = "all";
let selectedRestaurantId = null;
let mapScale = 1;
let mapOffsetX = 0;
let mapOffsetY = 0;
let mapDrag = null;

// LocalStorageからデータを読み込む
function loadData() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : {};
  } catch (error) {
    console.error("保存データの読み込みに失敗しました", error);
    return {};
  }
}

let restaurantData = loadData();

// お店のデータを取得
function getRestaurantData(id) {
  if (!restaurantData[id]) {
    restaurantData[id] = {
      visited: false,
      favorite: false,
      memo: ""
    };
  }

  return restaurantData[id];
}

// LocalStorageに保存
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurantData));
  renderJournal();
  renderRestaurantList();
}

// お店一覧を表示
function renderRestaurantList() {
  const list = document.getElementById("restaurant-list");
  const count = document.getElementById("restaurant-count");

  const filteredRestaurants = restaurants.filter(restaurant => {
    return currentCategory === "all" ||
      restaurant.category === currentCategory;
  });

  count.textContent = filteredRestaurants.length;
  list.innerHTML = "";

  filteredRestaurants.forEach(restaurant => {
    const data = getRestaurantData(restaurant.id);

    const card = document.createElement("div");
    card.className = "restaurant-card";

    card.innerHTML = `
      <div class="card-top">
        <span class="card-number">NO. ${String(restaurant.id).padStart(2, "0")}</span>
        <span class="card-status">
          ${data.visited ? "✓ 訪問済み" : ""}
          ${data.favorite ? "★ お気に入り" : ""}
        </span>
      </div>
      <h3>${restaurant.name}</h3>
      <p class="area">${restaurant.area}</p>
      <p class="description">${restaurant.description}</p>
    `;

    card.addEventListener("click", () => {
      openRestaurant(restaurant.id);
    });

    list.appendChild(card);
  });

  renderMapLocations();
}

// 地図から店舗を選べるようにする
function renderMapLocations() {
  const mapPins = document.getElementById("map-pins");
  mapPins.innerHTML = "";

  restaurants.forEach(restaurant => {
    const visible =
      currentCategory === "all" ||
      restaurant.category === currentCategory;

    if (!visible) return;

    const data = getRestaurantData(restaurant.id);

    const nearbyRestaurants = restaurants.filter(candidate => {
      return Math.abs(candidate.lat - restaurant.lat) <= 0.0025 &&
        Math.abs(candidate.lng - restaurant.lng) <= 0.0025;
    });
    const nearbyIndex = nearbyRestaurants.findIndex(item => item.id === restaurant.id);
    const angle = nearbyIndex * 2.399963;
    const radius = nearbyRestaurants.length > 1 ? 14 + (nearbyIndex % 3) * 5 : 0;
    const latitudeRange = 1.309 - 1.276;
    const longitudeRange = 103.905 - 103.805;
    const x = 6 + ((restaurant.lng - 103.805) / longitudeRange) * 88 +
      (Math.cos(angle) * radius / 1200) * 100;
    const y = 8 + ((1.309 - restaurant.lat) / latitudeRange) * 82 +
      (Math.sin(angle) * radius / 600) * 100;

    const pin = document.createElement("button");
    pin.type = "button";
    pin.className = `map-pin ${data.visited ? "visited" : ""}`;
    pin.style.left = `${x}%`;
    pin.style.top = `${y}%`;
    pin.title = restaurant.name;
    pin.setAttribute("aria-label", `${String(restaurant.id).padStart(2, "0")} ${restaurant.name}`);

    const number = document.createElement("span");
    number.textContent = String(restaurant.id).padStart(2, "0");
    pin.appendChild(number);
    pin.addEventListener("click", () => {
      openRestaurant(restaurant.id);
    });
    mapPins.appendChild(pin);
  });
}

function updateMapTransform() {
  document.getElementById("map-world").style.transform =
    `translate(${mapOffsetX}px, ${mapOffsetY}px) scale(${mapScale})`;
}

function initializeMapInteractions() {
  const canvas = document.getElementById("map-canvas");

  canvas.addEventListener("pointerdown", event => {
    if (event.target.closest(".map-pin, .map-controls")) return;

    mapDrag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: mapOffsetX,
      offsetY: mapOffsetY
    };
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add("dragging");
  });

  canvas.addEventListener("pointermove", event => {
    if (!mapDrag || event.pointerId !== mapDrag.pointerId) return;

    mapOffsetX = mapDrag.offsetX + event.clientX - mapDrag.startX;
    mapOffsetY = mapDrag.offsetY + event.clientY - mapDrag.startY;
    updateMapTransform();
  });

  const finishDragging = event => {
    if (!mapDrag || event.pointerId !== mapDrag.pointerId) return;
    mapDrag = null;
    canvas.classList.remove("dragging");
  };

  canvas.addEventListener("pointerup", finishDragging);
  canvas.addEventListener("pointercancel", finishDragging);

  document.querySelectorAll(".map-control").forEach(button => {
    button.addEventListener("click", () => {
      if (button.dataset.mapAction === "reset") {
        mapScale = 1;
        mapOffsetX = 0;
        mapOffsetY = 0;
      } else {
        const zoomDirection = button.dataset.mapAction === "zoom-in" ? 1 : -1;
        mapScale = Math.min(2.5, Math.max(1, mapScale + zoomDirection * 0.25));
      }
      updateMapTransform();
    });
  });
}

// お店の詳細を開く
function openRestaurant(id) {
  selectedRestaurantId = id;

  const restaurant = restaurants.find(item => item.id === id);
  const data = getRestaurantData(id);

  document.getElementById("modal-name").textContent = restaurant.name;
  document.getElementById("modal-area").textContent = restaurant.area;
  document.getElementById("modal-description").textContent = restaurant.description;
  document.getElementById("memo-input").value = data.memo;
  document.getElementById("modal-map-link").href =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${restaurant.lat},${restaurant.lng}`)}`;

  updateModalButtons();

  document.getElementById("restaurant-modal").classList.add("show");
}

// モーダル内のボタン表示を更新
function updateModalButtons() {
  const data = getRestaurantData(selectedRestaurantId);

  const visitedButton = document.getElementById("visited-button");
  const favoriteButton = document.getElementById("favorite-button");

  visitedButton.textContent = data.visited
    ? "✓ 訪問済み（クリックで解除）"
    : "訪問済みにする";

  favoriteButton.textContent = data.favorite
    ? "★ お気に入り解除"
    : "☆ お気に入り";
}

// モーダルを閉じる
function closeModal() {
  document.getElementById("restaurant-modal").classList.remove("show");
}

// 訪問済みボタン
document.getElementById("visited-button").addEventListener("click", () => {
  const data = getRestaurantData(selectedRestaurantId);
  data.visited = !data.visited;

  saveData();
  updateModalButtons();
});

// お気に入りボタン
document.getElementById("favorite-button").addEventListener("click", () => {
  const data = getRestaurantData(selectedRestaurantId);
  data.favorite = !data.favorite;

  saveData();
  updateModalButtons();
});

// メモを保存
document.getElementById("save-memo").addEventListener("click", () => {
  const data = getRestaurantData(selectedRestaurantId);
  data.memo = document.getElementById("memo-input").value;

  saveData();

  alert("メモを保存しました！");
});

// モーダルを閉じる操作
document.getElementById("close-modal").addEventListener("click", closeModal);

document.getElementById("restaurant-modal").addEventListener("click", event => {
  if (event.target.id === "restaurant-modal") {
    closeModal();
  }
});

// カテゴリー切り替え
document.querySelectorAll(".filter-button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-button").forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");
    currentCategory = button.dataset.category;

    renderRestaurantList();
  });
});

// 旅の記録を表示
function renderJournal() {
  const journalList = document.getElementById("journal-list");

  const visitedRestaurants = restaurants.filter(restaurant => {
    return getRestaurantData(restaurant.id).visited;
  });

  const favoriteRestaurants = restaurants.filter(restaurant => {
    return getRestaurantData(restaurant.id).favorite;
  });

  document.getElementById("visited-count").textContent =
    visitedRestaurants.length;

  document.getElementById("favorite-count").textContent =
    favoriteRestaurants.length;

  journalList.innerHTML = "";

  if (visitedRestaurants.length === 0) {
    journalList.innerHTML = "<p>まだ訪問したお店はありません。気になるお店に行ってみよう！</p>";
    return;
  }

  visitedRestaurants.forEach(restaurant => {
    const data = getRestaurantData(restaurant.id);

    const item = document.createElement("div");
    item.className = "journal-item";

    item.innerHTML = `
      <strong>${restaurant.name}</strong>
      <small>${restaurant.area}</small>
      ${data.memo ? `<p>${data.memo}</p>` : ""}
    `;

    item.addEventListener("click", () => {
      openRestaurant(restaurant.id);
    });

    journalList.appendChild(item);
  });
}

// 初期表示
renderRestaurantList();
renderJournal();
initializeMapInteractions();
