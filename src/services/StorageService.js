import { Habit } from "../models/Habit.js";
import { TimedHabit } from "../models/TimedHabit.js";

const STORAGE_KEY = "free_habits_data_v1";

export class StorageService {
  /**
   * Loads persisted habits from localStorage.
   * Restores appropriate Habit or TimedHabit instances.
   */
  static loadHabits() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed.map((item) => {
        if (item.type === "TimedHabit") {
          return TimedHabit.fromJSON(item);
        }
        return Habit.fromJSON(item);
      });
    } catch (error) {
      console.error("Error loading habits from localStorage:", error);
      return [];
    }
  }

  /**
   * Serializes and persists habit instances into localStorage.
   */
  static saveHabits(habits) {
    try {
      const serialized = habits.map((habit) => habit.toJSON());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    } catch (error) {
      console.error("Error saving habits to localStorage:", error);
    }
  }
}
