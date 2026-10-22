export class LogTracker {
  #dates = [];

  constructor(initialDates = []) {
    if (Array.isArray(initialDates)) {
      initialDates.forEach((date) => this.addLog(date));
    }
  }

  addLog(date) {
    if (typeof date !== "string" || date.length !== 10) {
      return null;
    }
    if (this.#dates.includes(date)) {
      return date;
    }
    this.#dates.push(date);
    return date;
  }

  getLogs() {
    return [...this.#dates];
  }

  removeLog(date) {
    const index = this.#dates.indexOf(date);
    if (index !== -1) {
      this.#dates.splice(index, 1);
      return true;
    }
    return false;
  }
}
