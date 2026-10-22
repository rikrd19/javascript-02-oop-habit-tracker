export class DailyStreakCalculator {
  calculate(habit, logs, today) {
    if (!logs || logs.length === 0) {
      return 0;
    }

    const uniqueLogs = new Set(logs);
    let streak = 0;
    let currentDate = new Date(today);
    currentDate.setHours(0, 0, 0, 0);

    // If today is not checked in yet, evaluate from yesterday to maintain an active streak
    const todayStr = this.#getDateString(currentDate);
    if (!uniqueLogs.has(todayStr)) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    while (uniqueLogs.has(this.#getDateString(currentDate))) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  }

  #getDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}

export class WeeklyStreakCalculator {
  calculate(habit, logs, today) {
    if (!logs || logs.length === 0) {
      return 0;
    }

    const weeks = this.#groupByWeek(logs);
    let streak = 0;
    let expectedWeek = this.#getWeekKey(today);

    // If current week has no logs yet, evaluate starting from previous week
    if (!weeks[expectedWeek]) {
      expectedWeek = this.#getPreviousWeek(expectedWeek);
    }

    while (weeks[expectedWeek]) {
      streak++;
      expectedWeek = this.#getPreviousWeek(expectedWeek);
    }

    return streak;
  }

  #groupByWeek(logs) {
    const weeks = {};
    logs.forEach((log) => {
      const weekKey = this.#getWeekKey(new Date(log + "T00:00:00"));
      if (!weeks[weekKey]) {
        weeks[weekKey] = [];
      }
      weeks[weekKey].push(log);
    });
    return weeks;
  }

  #getWeekKey(date) {
    const year = date.getFullYear();
    const week = this.#getWeekNumber(date);
    return `${year}-W${String(week).padStart(2, "0")}`;
  }

  #getWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  }

  #getPreviousWeek(weekKey) {
    const [year, weekStr] = weekKey.split("-W");
    let week = parseInt(weekStr, 10);
    let y = parseInt(year, 10);

    week--;
    if (week < 1) {
      y--;
      week = 52;
    }

    return `${y}-W${String(week).padStart(2, "0")}`;
  }
}

export const STREAK_CALCULATORS = {
  daily: new DailyStreakCalculator(),
  weekly: new WeeklyStreakCalculator(),
};
