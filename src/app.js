import { Habit } from "./models/Habit.js";
import { TimedHabit } from "./models/TimedHabit.js";
import { StorageService } from "./services/StorageService.js";

const MAX_HABITS = 5;

// Load persisted habits from localStorage or initialize empty collection
let habits = StorageService.loadHabits();

const motivationalQuotes = [
  "La fuerza no viene de la capacidad. Viene de la voluntad.",
  "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
  "No esperes. El momento nunca será perfecto.",
  "El único modo de hacer un gran trabajo es amar lo que haces.",
  "El futuro pertenece a quienes creen en la belleza de sus sueños.",
  "Tu tiempo es limitado, no lo desperdicies viviendo la vida de otros.",
  "El fracaso es la oportunidad de empezar de nuevo con más inteligencia.",
  "No cuentes los días, haz que los días cuenten.",
  "La disciplina es el puente entre metas y logros.",
  "Pequeños pasos diarios llevan a grandes cambios.",
  "La persistencia es el camino del éxito.",
  "Hoy es el primer día del resto de tu vida.",
  "El secreto para avanzar es empezar.",
  "Cada día es una nueva oportunidad para ser mejor.",
  "Los límites solo existen en tu mente.",
  "La acción es la clave fundamental para todo éxito.",
  "Transforma tus hábitos, transforma tu vida.",
  "El progreso es progreso, no importa lo pequeño que sea.",
  "La consistencia vence al talento.",
  "Hoy es el mañana que esperabas ayer.",
];

let dailyQuoteText = getRandomQuote();

function addHabit(name, frequency) {
  if (habits.length >= MAX_HABITS) {
    showMessage("Has alcanzado el límite de 5 hábitos", "error");
    return null;
  }

  if (!name || name.trim().length === 0) {
    showMessage("El nombre del hábito es obligatorio", "error");
    return null;
  }

  try {
    const habit = new Habit(name.trim(), frequency);
    habits.push(habit);
    StorageService.saveHabits(habits);
    return habit;
  } catch (error) {
    showMessage(error.message, "error");
    return null;
  }
}

function logHabit(habitId, date) {
  const habit = habits.find((h) => h.id === habitId);
  if (!habit) {
    showMessage("Hábito no encontrado", "error");
    return null;
  }

  const result = habit.registerCheckIn(date);
  if (result) {
    StorageService.saveHabits(habits);
  }
  return result;
}

function removeLog(habitId, date) {
  const habit = habits.find((h) => h.id === habitId);
  if (habit) {
    const removed = habit.removeCheckIn(date);
    if (removed) {
      StorageService.saveHabits(habits);
    }
    return removed;
  }
  return false;
}

function getStatistics() {
  const totalHabits = habits.length;
  let totalCheckIns = 0;

  const habitCounts = {};
  habits.forEach((habit) => {
    const logs = habit.getLogs();
    totalCheckIns += logs.length;
    habitCounts[habit.name] = logs.length;
  });

  let mostActiveHabit = "-";
  if (totalCheckIns > 0) {
    mostActiveHabit = Object.entries(habitCounts).sort(
      (a, b) => b[1] - a[1],
    )[0][0];
  }

  return {
    totalHabits,
    totalCheckIns,
    mostActiveHabit,
  };
}

function showMessage(message, type = "success") {
  const messageBox = document.getElementById("messageBox");
  if (!messageBox) return;

  messageBox.textContent = message;
  messageBox.className = `message-box ${type}`;

  setTimeout(() => {
    messageBox.classList.add("hidden");
  }, 3000);
}

/**
 * Safely renders the monthly habit matrix.
 * Uses native DOM APIs and textContent to guarantee XSS immunity.
 */
function renderHabits() {
  const habitsTable = document.getElementById("habitsTable");
  const habitSelect = document.getElementById("habitSelect");
  const createHabitBtn = document.getElementById("openCreateModal");

  if (!habitsTable || !habitSelect || !createHabitBtn) return;

  if (habits.length === 0) {
    habitsTable.innerHTML = "";
    const emptyMsg = document.createElement("p");
    emptyMsg.className = "empty-state";
    emptyMsg.textContent = 'No hay hábitos. Haz clic en "Crear Hábito" para comenzar.';
    habitsTable.appendChild(emptyMsg);

    habitSelect.innerHTML = '<option value="">Selecciona un hábito</option>';
    createHabitBtn.style.display = "block";
    renderStreaks();
    return;
  }

  createHabitBtn.style.display = habits.length >= MAX_HABITS ? "none" : "block";

  // Safely clear table container
  habitsTable.replaceChildren();

  const monthDays = getCurrentMonthDays();

  // Header row
  const headerRow = document.createElement("div");
  headerRow.className = "habit-row habit-header";

  const dayLabel = document.createElement("span");
  dayLabel.className = "habit-day-label";
  dayLabel.textContent = "Día";
  headerRow.appendChild(dayLabel);

  habits.forEach((habit) => {
    const habitName = document.createElement("span");
    habitName.className = "habit-name";
    habitName.textContent = habit.name; // XSS safe
    headerRow.appendChild(habitName);
  });
  habitsTable.appendChild(headerRow);

  // Month day rows
  monthDays.forEach((date) => {
    const row = document.createElement("div");
    row.className = "habit-row";

    const daySpan = document.createElement("span");
    daySpan.className = "habit-day";
    daySpan.textContent = date.split("-")[2];
    row.appendChild(daySpan);

    habits.forEach((habit) => {
      const checkbox = document.createElement("div");
      const isChecked = habit.getLogs().includes(date);
      checkbox.className = `habit-checkbox ${isChecked ? "checked" : ""}`;
      checkbox.dataset.habitId = String(habit.id);
      checkbox.dataset.date = date;
      row.appendChild(checkbox);
    });

    habitsTable.appendChild(row);
  });

  // Update register modal select options
  habitSelect.innerHTML = '<option value="">Selecciona un hábito</option>';
  habits.forEach((habit) => {
    const option = document.createElement("option");
    option.value = String(habit.id);
    option.textContent = habit.name;
    habitSelect.appendChild(option);
  });

  renderStreaks();
}

/**
 * Renders streak cards by cloning the native HTML5 <template>.
 */
function renderStreaks() {
  const streaksContainer = document.getElementById("streaksContainer");
  const template = document.getElementById("streakCardTemplate");
  if (!streaksContainer || !template) return;

  streaksContainer.replaceChildren();

  if (habits.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.className = "empty-state";
    emptyMsg.textContent = "Las rachas aparecerán aquí cuando registres hábitos.";
    streaksContainer.appendChild(emptyMsg);
    return;
  }

  habits.forEach((habit) => {
    const streak = habit.calculateStreak();
    const logs = habit.getLogs();
    const isActive = streak > 0;
    const frequencyLabel = habit.frequency === "daily" ? "Diario" : "Semanal";
    const unitLabel =
      habit.frequency === "daily"
        ? streak === 1
          ? "día"
          : "días"
        : streak === 1
          ? "semana"
          : "semanas";
    const flameIcon = isActive ? "🔥" : "⚪";

    // Clone native HTML5 template
    const clone = template.content.cloneNode(true);
    const card = clone.querySelector(".streak-card");

    card.className = `streak-card ${isActive ? "streak-active" : "streak-inactive"}`;
    card.querySelector(".streak-habit-name").textContent = habit.name; // XSS safe
    card.querySelector(".streak-frequency").textContent = frequencyLabel;
    card.querySelector(".streak-flame").textContent = flameIcon;
    card.querySelector(".streak-count").textContent = String(streak);
    card.querySelector(".streak-label").textContent = unitLabel;
    card.querySelector(".check-count").textContent = `✓ ${logs.length} check-ins`;

    streaksContainer.appendChild(clone);
  });
}

function getCurrentMonthDays() {
  const dates = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const currentDay = today.getDate();

  for (let day = 1; day <= currentDay; day++) {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    dates.push(`${year}-${m}-${d}`);
  }

  return dates;
}

function updateDateTime() {
  const now = new Date();
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const dayNumber = document.getElementById("dayNumber");
  const monthName = document.getElementById("monthName");
  const dayName = document.getElementById("dayName");

  if (dayNumber) dayNumber.textContent = String(now.getDate());
  if (monthName) monthName.textContent = months[now.getMonth()];
  if (dayName) dayName.textContent = days[now.getDay()];
}

function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
}

function renderQuote() {
  const savedQuote = document.getElementById("savedQuote");
  if (savedQuote) {
    savedQuote.textContent = dailyQuoteText || "Escribe tu frase del día...";
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("active");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("active");
}

function setupModalListeners() {
  const openCreateModalBtn = document.getElementById("openCreateModal");
  if (openCreateModalBtn) {
    openCreateModalBtn.addEventListener("click", () => {
      openModal("createHabitModal");
    });
  }

  const openRegisterModalBtn = document.getElementById("openRegisterModal");
  if (openRegisterModalBtn) {
    openRegisterModalBtn.addEventListener("click", () => {
      if (habits.length === 0) {
        showMessage("Primero crea un hábito", "error");
        return;
      }
      openModal("registerModal");
    });
  }

  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", function () {
      closeModal(this.dataset.modal);
    });
  });

  document.querySelectorAll(".btn-secondary").forEach((btn) => {
    btn.addEventListener("click", function () {
      const modalId = this.dataset.modal;
      if (modalId) closeModal(modalId);
    });
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.classList.remove("active");
      }
    });
  });
}

/**
 * Initializes the application and binds a single event listener via delegation.
 */
function initApp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;

  const checkInDateInput = document.getElementById("checkInDate");
  if (checkInDateInput) {
    checkInDateInput.value = today;
  }

  updateDateTime();
  setupModalListeners();

  // Event Delegation on habitsTable (single persistent listener in memory)
  const habitsTable = document.getElementById("habitsTable");
  if (habitsTable) {
    habitsTable.addEventListener("click", (e) => {
      const checkbox = e.target.closest(".habit-checkbox");
      if (!checkbox) return;

      const habitId = parseInt(checkbox.dataset.habitId, 10);
      const date = checkbox.dataset.date;

      if (checkbox.classList.contains("checked")) {
        removeLog(habitId, date);
        checkbox.classList.remove("checked");
        showMessage("Check-in removido", "success");
        renderStreaks();
      } else {
        const log = logHabit(habitId, date);
        if (log) {
          checkbox.classList.add("checked");
          showMessage("Check-in registrado", "success");
          renderStreaks();
        }
      }
    });
  }

  // Habit creation event listener
  const createHabitBtn = document.getElementById("createHabitBtn");
  if (createHabitBtn) {
    createHabitBtn.addEventListener("click", () => {
      const nameInput = document.getElementById("habitName");
      const frequencyInput = document.getElementById("habitFrequency");
      if (!nameInput || !frequencyInput) return;

      const name = nameInput.value;
      const frequency = frequencyInput.value;

      const habit = addHabit(name, frequency);
      if (habit) {
        showMessage(`Hábito "${habit.name}" creado exitosamente`, "success");
        nameInput.value = "";
        renderHabits();
        closeModal("createHabitModal");

        if (habits.length >= MAX_HABITS) {
          showMessage("Has alcanzado el límite máximo de 5 hábitos", "success");
        }
      }
    });
  }

  // Manual check-in modal event listener
  const checkInBtn = document.getElementById("checkInBtn");
  if (checkInBtn) {
    checkInBtn.addEventListener("click", () => {
      const habitSelect = document.getElementById("habitSelect");
      const dateInput = document.getElementById("checkInDate");
      if (!habitSelect || !dateInput) return;

      const habitId = parseInt(habitSelect.value, 10);
      const date = dateInput.value;

      if (!habitId || !date) {
        showMessage("Selecciona un hábito y una fecha", "error");
        return;
      }

      const log = logHabit(habitId, date);
      if (log) {
        const habit = habits.find((h) => h.id === habitId);
        showMessage(`Check-in registrado para ${habit.name}`, "success");
        renderHabits();
        closeModal("registerModal");
      }
    });
  }

  renderHabits();
  renderQuote();

  // Console demonstration of inheritance and polymorphism
  const demoHabit = new Habit("Leer", "daily");
  const demoTimedHabit = new TimedHabit("Meditar", "daily", 20);
  console.log("Demo Habit:", demoHabit.toDisplayString());
  console.log("Demo TimedHabit:", demoTimedHabit.toDisplayString());
  console.log("instanceof Habit:", demoTimedHabit instanceof Habit);
  console.log("instanceof TimedHabit:", demoTimedHabit instanceof TimedHabit);
}

document.addEventListener("DOMContentLoaded", initApp);
