let foods = JSON.parse(localStorage.getItem('foods')) || [
  { name: "Nasi Goreng", calories: 500, image: "https://buckets.sasa.co.id/v1/AUTH_Assets/Assets/p/website/medias/page_medias/nasi_goreng_oriental.jpg" },
  { name: "Ayam Bakar", calories: 350, image: "https://asset.kompas.com/crops/WTuA1Jn_cJEFlr9UgBhA-72n8yI=/3x0:700x465/1200x800/data/photo/2020/12/30/5fec5602f116e.jpg" },
  { name: "Sate Ayam", calories: 400, image: "https://i.ytimg.com/vi/R0mDzP0A_DQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCKevZCAetrLVnQIhN9FBW8vvPfcg" },
  { name: "Tempe Goreng", calories: 200, image: "https://asset.kompas.com/crops/TZmsk7G1DdOaRfrE8nudW6V6Ji0=/0x0:1000x667/1200x800/data/photo/2023/04/27/6449d3bbb940a.jpg"}
]
let selectedFoods = [];
let calorieLimit = localStorage.getItem("batasKalori");
let menuHistory = JSON.parse(localStorage.getItem('menuHistory')) || [];
let editingFoodIndex = null;
let editingMenuId = null;
let program = localStorage.getItem("program")

const foodList = document.getElementById('foodList');
const totalCaloriesEl = document.getElementById('totalCalories');
const saveMenuBtn = document.getElementById('saveMenuBtn');
const searchInput = document.getElementById('searchInput');
const menuHistoryEl = document.getElementById('menuHistory');
const foodFormContainer = document.getElementById('foodFormContainer');
const showAddFoodFormBtn = document.getElementById('showAddFoodForm');
const saveFoodBtn = document.getElementById('saveFoodBtn');
const cancelFoodBtn = document.getElementById('cancelFoodBtn');
const foodNameInput = document.getElementById('foodName');
const foodCaloriesInput = document.getElementById('foodCalories');
const foodImageInput = document.getElementById('foodImage');
const formTitle = document.getElementById('formTitle');
const calorieLimitLabel = document.getElementById('calorieLimitLabel');

// ===== RENDER MAKANAN =====
function renderFoods(filter = '') {
  foodList.innerHTML = '';
  foods
    .filter(f => f.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach((food, i) => {
      const card = document.createElement('div');
      card.className = 'card' + (selectedFoods.includes(i) ? ' selected' : '');
      card.innerHTML = `
        <img src="${food.image}" alt="${food.name}">
        <h4>${food.name}</h4>
        <p>${food.calories} Kalori</p>
        <div style="display : flex; justify-content: center; gap:20px; padding: 8px 12px;">
        <button class="button-food" onclick="editFood(${i})">Edit</button>
        <button class="button-food" onclick="deleteFood(${i})">Delete</button>
        </div>
      `;
      card.addEventListener('click', e => {
        if (e.target.tagName !== 'BUTTON') toggleSelectFood(i);
      });
      foodList.appendChild(card);
    });
    
  updateTotalCalories();
  checkTodayMenu();
}

function updateTotalCalories() {
  const total = selectedFoods.reduce((sum, i) => sum + foods[i].calories, 0);
  totalCaloriesEl.textContent = `Total Calories: ${total}`;
  totalCaloriesEl.classList.toggle('red', total > parseInt(calorieLimit));
  calorieLimitLabel.textContent = `Calories Limit: ${parseInt(calorieLimit)}`;
}

// ===== CRUD MAKANAN =====
function toggleSelectFood(index) {
  const pos = selectedFoods.indexOf(index);
  if (pos === -1) selectedFoods.push(index);
  else selectedFoods.splice(pos, 1);
  updateTotalCalories();
  renderFoods(searchInput.value);
}

function deleteFood(index) {
  if (confirm("Delete this food?")) {
    foods.splice(index, 1);
    localStorage.setItem('foods', JSON.stringify(foods));
    renderFoods(searchInput.value);
  }
}

function editFood(index) {
  editingFoodIndex = index;
  formTitle.textContent = "Edit Food";
  foodNameInput.value = foods[index].name;
  foodCaloriesInput.value = foods[index].calories;
  foodImageInput.value = foods[index].image;
  foodFormContainer.classList.remove('hidden');
}

saveFoodBtn.addEventListener('click', () => {
  const name = foodNameInput.value.trim();
  const calories = parseInt(foodCaloriesInput.value);
  const image = foodImageInput.value.trim() || "https://via.placeholder.com/150";
  if (!name || isNaN(calories)) return alert("Fill all data!");

  if (editingFoodIndex !== null) {
    foods[editingFoodIndex] = { name, calories, image };
    editingFoodIndex = null;
  } else {
    foods.push({ name, calories, image });
  }
  localStorage.setItem('foods', JSON.stringify(foods));
  foodFormContainer.classList.add('hidden');
  foodNameInput.value = '';
  foodCaloriesInput.value = '';
  foodImageInput.value = '';
  renderFoods(searchInput.value);
});

cancelFoodBtn.addEventListener('click', () => {
  editingFoodIndex = null;
  foodFormContainer.classList.add('hidden');
});

showAddFoodFormBtn.addEventListener('click', () => {
  formTitle.textContent = "Add Food";
  foodFormContainer.classList.remove('hidden');
});

// ===== MENU HARIAN =====
saveMenuBtn.addEventListener('click', () => {
  if (selectedFoods.length === 0) return alert("Choose food first!");

  const total = selectedFoods.reduce((sum, i) => sum + foods[i].calories, 0);
  if (total > calorieLimit) return alert("Total calories exceed the limit!");

  const today = new Date().toLocaleDateString('en-CA');

  const menuData = selectedFoods.map(i => ({ ...foods[i] }));

  const existingIndex = menuHistory.findIndex(m => m.date === today);

  if (editingMenuId) {
    const idx = menuHistory.findIndex(m => m.id === editingMenuId);
    if (idx !== -1) {
      menuHistory[idx] = { ...menuHistory[idx], foods: menuData, total };
      alert("Daily menu successfully updated!");
    }
    editingMenuId = null;
  } else {
    if (existingIndex !== -1) {
      return alert("The menu for today's date has been saved! Please edit it if you wish to change it.");
    }
    menuHistory.push({ id: Date.now(), date: today, foods: menuData, total });
    alert("Today's menu has been saved successfully!");
  }

  localStorage.setItem('menuHistory', JSON.stringify(menuHistory));
  selectedFoods = [];
  renderFoods(searchInput.value);
  renderMenuHistory();
  updateTotalCalories();
});

function renderMenuHistory() {
  menuHistoryEl.innerHTML = '';
  menuHistory.forEach(menu => {
    const foodsList = menu.foods.map(f => `<li>${f.name} - ${f.calories} Kalori</li>`).join('');
    const item = document.createElement('div');
    item.className = 'menu-item';
    item.innerHTML = `
      <h4>${menu.date}</h4>
      <p><strong> -- Program ${program} -- </strong></p>
      <ul>${foodsList}</ul>
      <p style="margin-top:20px"><strong>Total Calories: ${menu.total}</strong></p>
      <div style="display : flex; gap:1px;">
      <button class="button-food" onclick="editMenu(${menu.id})">Edit</button>
      <button class="button-food" onclick="deleteMenu(${menu.id})">Delete</button>
      </div>
    `;
    menuHistoryEl.appendChild(item);
  });
  checkTodayMenu();
}

function editMenu(id) {
  const menu = menuHistory.find(m => m.id === id);
  if (!menu) return;
  selectedFoods = [];
  menu.foods.forEach(f => {
    const index = foods.findIndex(food => food.name === f.name);
    if (index !== -1) selectedFoods.push(index);
  });
  editingMenuId = id;
  renderFoods(searchInput.value);
  updateTotalCalories();
}

function deleteMenu(id) {
  if (confirm("Delete this menu?")) {
    menuHistory = menuHistory.filter(m => m.id !== id);
    localStorage.setItem('menuHistory', JSON.stringify(menuHistory));
    renderMenuHistory();
  }
}

searchInput.addEventListener('input', e => renderFoods(e.target.value));

function checkTodayMenu() {
  const today = new Date().toLocaleDateString('en-CA');

  const alreadySaved = menuHistory.some(m => m.date === today);
  saveMenuBtn.disabled = alreadySaved && !editingMenuId;
  saveMenuBtn.textContent = alreadySaved && !editingMenuId
    ? "Today's Menu is Saved"
    : "Save Today's Menu";
}

// ===== INIT =====
renderFoods();
renderMenuHistory();
