let foods = JSON.parse(localStorage.getItem('foods')) || [
  { name: "Nasi Goreng", calories: 500, image: "https://buckets.sasa.co.id/v1/AUTH_Assets/Assets/p/website/medias/page_medias/nasi_goreng_oriental.jpg" },
  { name: "Ayam Bakar", calories: 350, image: "https://asset.kompas.com/crops/WTuA1Jn_cJEFlr9UgBhA-72n8yI=/3x0:700x465/1200x800/data/photo/2020/12/30/5fec5602f116e.jpg" },
  { name: "Sate Ayam", calories: 400, image: "https://i.ytimg.com/vi/R0mDzP0A_DQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCKevZCAetrLVnQIhN9FBW8vvPfcg" },
  { name: "Tempe Goreng", calories: 200, image: "https://img-global.cpcdn.com/recipes/0d240827a5bd59f5/680x781cq80/nasi-uduk-rice-cooker-foto-resep-utama.jpg"}
]
let selectedFoods = [];
let calorieLimit = localStorage.getItem("batasKalori");
let menuHistory = JSON.parse(localStorage.getItem('menuHistory')) || [];
let editingFoodIndex = null;
let editingMenuId = null;
let program = localStorage.getItem("program")

// Calendar variables
let currentCalendarDate = new Date();
let selectedCalendarDate = null;

const foodList = document.getElementById('foodList');
let foodSwiper = null;
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

// Calendar elements
const currentMonthEl = document.getElementById('currentMonth');
const calendarGridEl = document.getElementById('calendarGrid');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const selectedDateInfoEl = document.getElementById('selectedDateInfo');
const selectedDateTitleEl = document.getElementById('selectedDateTitle');
const selectedDateMenuEl = document.getElementById('selectedDateMenu');

// ===== RENDER MAKANAN =====
function renderFoods(filter = '') {
  // Rebuild slides
  foodList.innerHTML = '';
  foods
    .filter(f => f.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach((food, i) => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';

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

      slide.appendChild(card);
      foodList.appendChild(slide);
    });

  // (Re)initialize swiper
  initOrUpdateFoodSwiper();

  updateTotalCalories();
  checkTodayMenu();
}

function initOrUpdateFoodSwiper() {
  // Destroy existing instance to avoid duplicates
  if (foodSwiper) {
    try { foodSwiper.destroy(true, true); } catch (e) {}
    foodSwiper = null;
  }
  const carouselEl = document.getElementById('foodCarousel');
  if (!carouselEl) return;
  foodSwiper = new Swiper('#foodCarousel', {
    slidesPerView: 1.2,
    spaceBetween: 12,
    pagination: {
      el: '#foodCarousel .swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '#foodCarousel .swiper-button-next',
      prevEl: '#foodCarousel .swiper-button-prev'
    },
    breakpoints: {
      576: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 4 }
    }
  });
}

function updateTotalCalories() {
  const total = selectedFoods.reduce((sum, i) => sum + foods[i].calories, 0);
  totalCaloriesEl.textContent = `Total Calories: ${total}`;
  const parsedLimit = parseInt(calorieLimit);
  const overLimit = Number.isFinite(parsedLimit) ? total > parsedLimit : false;
  totalCaloriesEl.classList.toggle('red', overLimit);
  calorieLimitLabel.textContent = `Calories Limit: ${Number.isFinite(parsedLimit) ? parsedLimit : '-'}`;

  // Persist over-limit state on the save button for UI control in checkTodayMenu
  if (saveMenuBtn) {
    saveMenuBtn.dataset.overLimit = overLimit ? '1' : '0';
  }
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
  const image = foodImageInput.value.trim() || "https://pngtree.com/freepng/no-image-vector-illustration-isolated-png-image_1694547";
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
  if (parseInt(calorieLimit) && total > parseInt(calorieLimit)) {
    alert("Total calories exceed the limit! Please adjust your selection.");
    return;
  }

  const today = new Date().toLocaleDateString('en-CA');
  const menuData = selectedFoods.map(i => ({ ...foods[i] }));

  // Check if we're editing a calendar menu
  if (selectedCalendarDate && editingMenuId) {
    const idx = menuHistory.findIndex(m => m.id === editingMenuId);
    if (idx !== -1) {
      menuHistory[idx] = { ...menuHistory[idx], foods: menuData, total, date: selectedCalendarDate };
      alert("Meal plan successfully updated!");
    }
    editingMenuId = null;
  } else if (selectedCalendarDate) {
    // Creating new calendar menu
    const existingIndex = menuHistory.findIndex(m => m.date === selectedCalendarDate);
    if (existingIndex !== -1) {
      return alert("A meal plan for this date already exists! Please edit it if you wish to change it.");
    }
    
    menuHistory.push({ 
      id: Date.now(), 
      date: selectedCalendarDate, 
      foods: menuData, 
      total 
    });
    alert("Meal plan created successfully!");
  } else {
    // Regular today's menu
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
  }

  localStorage.setItem('menuHistory', JSON.stringify(menuHistory));
  selectedFoods = [];
  renderFoods(searchInput.value);
  renderMenuHistory();
  renderCalendar();
  updateTotalCalories();
  checkTodayMenu();
  
  // Refresh the selected date info if we were working on a calendar date
  const workingCalendarDate = selectedCalendarDate;
  if (workingCalendarDate) {
    selectedCalendarDate = null; // Clear it after storing
    const dayElement = document.querySelector(`[data-date="${workingCalendarDate}"]`);
    if (dayElement) {
      selectDate(workingCalendarDate, dayElement);
    }
  }
});

function renderMenuHistory() {
  if (!menuHistoryEl) return;
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
  const isOverLimit = saveMenuBtn?.dataset?.overLimit === '1';

  // When over the limit, force-disable and show warning text
  if (isOverLimit) {
    saveMenuBtn.disabled = true;
    saveMenuBtn.textContent = "Over calorie limit - adjust selection";
    return;
  }

  // Don't disable button if we're working on a calendar date
  if (selectedCalendarDate) {
    saveMenuBtn.disabled = false;
    saveMenuBtn.textContent = editingMenuId ? "Update Meal Plan" : "Create Meal Plan";
  } else {
    saveMenuBtn.disabled = alreadySaved && !editingMenuId;
    saveMenuBtn.textContent = alreadySaved && !editingMenuId
      ? "Today's Menu is Saved"
      : editingMenuId ? "Update Today's Menu" : "Save Today's Menu";
  }
}

// ===== INIT =====
renderFoods();
renderMenuHistory();

// ===== CALENDAR FUNCTIONALITY =====
function renderCalendar() {
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  
  // Update month title
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  currentMonthEl.textContent = `${monthNames[month]} ${year}`;
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // Clear calendar grid
  calendarGridEl.innerHTML = '';
  
  // Add day headers
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayHeaders.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'calendar-day-header';
    dayHeader.textContent = day;
    calendarGridEl.appendChild(dayHeader);
  });
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day empty';
    calendarGridEl.appendChild(emptyCell);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement('div');
    dayCell.className = 'calendar-day';
    dayCell.textContent = day;
    
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    dayCell.dataset.date = dateStr;
    
    // Check if this date has a saved menu
    const hasMenu = menuHistory.some(menu => menu.date === dateStr);
    if (hasMenu) {
      dayCell.classList.add('has-menu');
    }
    
    // Highlight today
    const today = new Date();
    if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
      dayCell.classList.add('today');
    }
    
    // Add click event
    dayCell.addEventListener('click', () => selectDate(dateStr, dayCell));
    
    calendarGridEl.appendChild(dayCell);
  }
}

function selectDate(dateStr, dayElement) {
  // Remove previous selection
  document.querySelectorAll('.calendar-day.selected').forEach(el => {
    el.classList.remove('selected');
  });
  
  // Add selection to clicked day
  dayElement.classList.add('selected');
  selectedCalendarDate = dateStr;
  
  // Update button text based on calendar selection
  checkTodayMenu();
  
  // Show selected date info
  selectedDateInfoEl.style.display = 'block';
  selectedDateTitleEl.textContent = `Meal Plan for ${formatDate(dateStr)}`;
  
  // Check if there's already a menu for this date
  const existingMenu = menuHistory.find(menu => menu.date === dateStr);
  if (existingMenu) {
    const foodsList = existingMenu.foods.map(f => `<li>${f.name} - ${f.calories} Kalori</li>`).join('');
    selectedDateMenuEl.innerHTML = `
      <div class="existing-menu">
        <h5>Existing Menu:</h5>
        <ul>${foodsList}</ul>
        <p><strong>Total Calories: ${existingMenu.total}</strong></p>
        <button class="button-food" onclick="editCalendarMenu('${dateStr}')">Edit Menu</button>
        <button class="button-food" onclick="deleteCalendarMenu('${dateStr}')">Delete Menu</button>
      </div>
    `;
  } else {
    selectedDateMenuEl.innerHTML = `
      <p>No meal plan for this date yet. Select foods and use the save button.</p>
    `;
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function editCalendarMenu(dateStr) {
  const menu = menuHistory.find(m => m.date === dateStr);
  
  // Set the selected calendar date so save button knows which date we're working on
  selectedCalendarDate = dateStr;
  
  if (menu) {
    // Editing existing menu - load the foods
    selectedFoods = [];
    menu.foods.forEach(f => {
      const index = foods.findIndex(food => food.name === f.name);
      if (index !== -1) selectedFoods.push(index);
    });
    editingMenuId = menu.id;
  } else {
    // Creating new menu - clear selection
    selectedFoods = [];
    editingMenuId = null;
  }
  
  renderFoods(searchInput.value);
  updateTotalCalories();
  checkTodayMenu(); // Update button text
  
  // Scroll to food selection area
  document.querySelector('.food-container').scrollIntoView({ behavior: 'smooth' });
}

function deleteCalendarMenu(dateStr) {
  if (confirm("Delete meal plan for this date?")) {
    menuHistory = menuHistory.filter(m => m.date !== dateStr);
    localStorage.setItem('menuHistory', JSON.stringify(menuHistory));
    renderMenuHistory();
    renderCalendar();
    selectDate(dateStr, document.querySelector(`[data-date="${dateStr}"]`));
  }
}

// Calendar event listeners
prevMonthBtn.addEventListener('click', () => {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
  renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
  renderCalendar();
});

// Initialize calendar
renderCalendar();
