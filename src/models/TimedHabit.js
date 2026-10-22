import { Habit } from "./Habit.js";
import { DomainError, ERROR_CODES } from "./DomainError.js";

export class TimedHabit extends Habit {
  #targetMinutes;

  constructor(
    name,
    frequency,
    targetMinutes,
    id = Habit.createId(),
    createdAt = new Date().toISOString(),
    logs = [],
  ) {
    super(name, frequency, id, createdAt, logs);
    this.targetMinutes = targetMinutes;
  }

  get targetMinutes() {
    return this.#targetMinutes;
  }

  set targetMinutes(value) {
    const minutes = Number(value);
    if (isNaN(minutes) || minutes <= 0) {
      throw new DomainError(
        "El objetivo de tiempo debe ser un número positivo.",
        ERROR_CODES.INVALID_TARGET_MINUTES,
      );
    }
    this.#targetMinutes = minutes;
  }

  toDisplayString() {
    const baseString = super.toDisplayString();
    return `${baseString} - ${this.#targetMinutes} min`;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: "TimedHabit",
      targetMinutes: this.#targetMinutes,
    };
  }

  static fromJSON(data) {
    return new TimedHabit(
      data.name,
      data.frequency,
      data.targetMinutes,
      data.id,
      data.createdAt,
      data.logs || [],
    );
  }

  static daily(name, targetMinutes) {
    return new TimedHabit(name, "daily", targetMinutes);
  }

  static weekly(name, targetMinutes) {
    return new TimedHabit(name, "weekly", targetMinutes);
  }
}
