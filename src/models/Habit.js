import { LogTracker } from "./LogTracker.js";
import { STREAK_CALCULATORS } from "./StreakCalculators.js";
import { DomainError, ERROR_CODES } from "./DomainError.js";

export class Habit {
  #name;
  #frequency;
  #id;
  #tracker;
  #createdAt;

  constructor(
    name,
    frequency,
    id = Habit.createId(),
    createdAt = new Date().toISOString(),
    logs = [],
  ) {
    this.#id = id;
    this.name = name;
    this.frequency = frequency;
    this.#createdAt = createdAt;
    this.#tracker = new LogTracker(logs);
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  set name(value) {
    const normalized = (value || "").trim();
    if (normalized.length < 3) {
      throw new DomainError(
        "El nombre del hábito debe tener al menos 3 caracteres.",
        ERROR_CODES.INVALID_NAME,
      );
    }
    this.#name = normalized;
  }

  get frequency() {
    return this.#frequency;
  }

  set frequency(value) {
    const validFrequencies = ["daily", "weekly"];
    if (!validFrequencies.includes(value)) {
      throw new DomainError(
        'La frecuencia debe ser "daily" o "weekly".',
        ERROR_CODES.INVALID_FREQUENCY,
      );
    }
    this.#frequency = value;
  }

  get createdAt() {
    return this.#createdAt;
  }

  rename(newName) {
    this.name = newName;
  }

  registerCheckIn(date) {
    const created = this.#tracker.addLog(date);
    if (!created) {
      return null;
    }
    return {
      habitId: this.id,
      date: created,
    };
  }

  getLogs() {
    return this.#tracker.getLogs();
  }

  removeCheckIn(date) {
    return this.#tracker.removeLog(date);
  }

  calculateStreak(today = new Date()) {
    const calculator = STREAK_CALCULATORS[this.#frequency];
    if (!calculator) {
      return 0;
    }
    return calculator.calculate(this, this.getLogs(), today);
  }

  toDisplayString() {
    return `${this.name} (${this.frequency})`;
  }

  toJSON() {
    return {
      type: "Habit",
      id: this.#id,
      name: this.#name,
      frequency: this.#frequency,
      createdAt: this.#createdAt,
      logs: this.getLogs(),
    };
  }

  static fromJSON(data) {
    return new Habit(
      data.name,
      data.frequency,
      data.id,
      data.createdAt,
      data.logs || [],
    );
  }

  static createId() {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  static daily(name) {
    return new Habit(name, "daily");
  }

  static weekly(name) {
    return new Habit(name, "weekly");
  }
}
