# FreeHabits — Object-Oriented Habit Tracker

> A modern, client-side habit tracking web application built with **Vanilla JavaScript (ES6+)** demonstrating **Object-Oriented Programming (OOP)** paradigms, clean architecture, and responsive UI design without external framework dependencies.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-Semantic_Markup-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Modern_Flexbox_&_Grid-1572B6?logo=css3&logoColor=white)
![Paradigm](https://img.shields.io/badge/Paradigm-OOP_/_Clean_Architecture-success)

---

## Table of Contents
- [Overview](#-overview)
- [OOP Core Concepts & Architecture](#-oop-core-concepts--architecture)
- [Design Patterns & Engineering Highlights](#-design-patterns--engineering-highlights)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Author](#-author)

---

## Overview

**FreeHabits** was engineered to demonstrate how modern, production-grade JavaScript can leverage native Object-Oriented design principles to solve state management, domain validation, and business logic challenges in browser applications.

The application allows users to define up to 5 habits (daily or weekly), track execution across an interactive monthly matrix, calculate streaks with dynamic algorithms, and view overall consistency metrics in real time.

---

## OOP Core Concepts & Architecture

The application's core domain model reflects the four fundamental pillars of Object-Oriented Programming:

### 1. Encapsulation & Data Protection
* **Private Class Fields (`#`):** Internal state such as `#name`, `#frequency`, `#createdAt`, and `#tracker` in the `Habit` class, as well as `#dates` in `LogTracker`, are strictly encapsulated.
* **Defensive Copying & Accessors:** Logs and collection references return clones (`[...this.#dates]`), preventing external mutation without going through validated domain methods.
* **Property Validation:** Setters enforce business constraints (e.g., verifying frequency against allowed domain values: `['daily', 'weekly']`).

### 2. Inheritance & Class Specialization
* Uses ES6 class extension (`class TimedHabit extends Habit`).
* Specializes base behavior by adding target duration constraints (`#targetMinutes`) while delegating common lifecycle management to the parent class via `super()`.

### 3. Polymorphism & Strategy Pattern
* Decouples streak calculation logic from the habit model by delegating computation to dedicated strategy classes: `DailyStreakCalculator` and `WeeklyStreakCalculator`.
* Both implement a consistent contract: `.calculate(habit, logs, today)`, allowing polymorphic execution without conditional branching cascades.

### 4. Abstraction & Static Factory Methods
* Exposes expressive static factory methods (`Habit.daily(name)`, `Habit.weekly(name)`, `TimedHabit.daily(name, minutes)`) to simplify instantiation and make client code declarative.

### 5. Domain Exception Handling
* Implements a custom error hierarchy (`class DomainError extends Error`) mapped against an enumeration dictionary (`ERROR_CODES`).
* Guards the system against invalid inputs, duplicate check-ins, out-of-range dates, or capacity overflow.

---

## Design Patterns & Engineering Highlights

* **Separation of Concerns:** Distinct division between domain entities (`Habit`, `TimedHabit`, `LogTracker`), calculation algorithms (Strategy pattern), and presentation/UI rendering layers.
* **Zero Framework Overhead:** Built purely on native web standards (ES Modules, modern DOM APIs, CSS Custom Properties).
* **Defensive State Modeling:** Guards against edge cases such as leap years, varying month lengths, and future date selections.

---

## Key Features

* **Interactive Monthly Matrix:** Real-time day-by-day habit calendar with dynamic active day detection.
* **Streak Computation Engine:** Real-time streak analysis for both daily and weekly frequencies.
* **Daily Motivational Quotes:** Rotational inspirational quotes to encourage user consistency.
* **Metrics & Analytics Dashboard:** Summarizes total active habits, total check-ins completed, and identifies the most consistent habit.
* **Accessible Modals & Notifications:** Clean UI modal flows with feedback toasts.

---

## Project Structure

```text
javascript-02-oop-habit-tracker/
├── src/
│   ├── index.html         # Semantic HTML5 layout and accessibility markup
│   ├── styles.css         # Design tokens, CSS variables, grid/flexbox layouts
│   ├── app.js             # Domain classes, business logic, and UI controllers
│   └── example.js         # Paradigm comparison benchmarks (Literals vs Prototypes)
├── package.json           # Node configuration, scripts, and dev dependencies
├── .gitignore             # Standardized git ignore rules
└── README.md              # Project technical documentation
```

---

## Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v16.0.0 or higher recommended)
* A modern web browser supporting ES2022+

### Installation & Run
1. Clone the repository:
   ```bash
   git clone https://github.com/rikrd19/javascript-02-oop-habit-tracker.git
   ```
2. Navigate into the project directory:
   ```bash
   cd javascript-02-oop-habit-tracker
   ```
3. Install development dependencies:
   ```bash
   npm install
   ```
4. Start the development server with live reload:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to the local address displayed in the terminal (typically `http://127.0.0.1:8080`).

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts a hot-reloading development server using `live-server`. |
| `npm start` | Serves the `src/` directory on port 8080 via `http-server`. |

---

## Author

**Ricardo Avila**
* GitHub: [@rikrd19](https://github.com/rikrd19)
* Repository: [javascript-02-oop-habit-tracker](https://github.com/rikrd19/javascript-02-oop-habit-tracker)

---
*All rights reserved © 2026*
