# FreeHabits — Object-Oriented Habit Tracker

> A modern, client-side habit tracking web application built with **Vanilla JavaScript (ES6+)** demonstrating **Object-Oriented Programming (OOP)** paradigms, modular clean architecture, and responsive UI design without external framework dependencies.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-Semantic_Markup-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Modern_Flexbox_&_Grid-1572B6?logo=css3&logoColor=white)
![Paradigm](https://img.shields.io/badge/Paradigm-OOP_/_Clean_Architecture-success)

---

## Table of Contents
- [Overview](#overview)
- [OOP Core Concepts and Architecture](#oop-core-concepts-and-architecture)
- [Enterprise Engineering Practices](#enterprise-engineering-practices)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Author](#author)

---

## Overview

**FreeHabits** demonstrates how modern Vanilla JavaScript can leverage native Object-Oriented design principles to solve state management, domain validation, and business logic challenges in browser applications.

The application allows users to define habits (daily or weekly), track execution across an interactive monthly matrix, calculate streaks in real time, and persist habits and check-in logs locally across browser sessions.

---

## OOP Core Concepts and Architecture

The application's core domain model reflects the four fundamental pillars of Object-Oriented Programming:

### 1. Encapsulation and Data Protection
* **Private Class Fields (`#`):** Internal states (`#name`, `#frequency`, `#createdAt`, `#tracker`, `#dates`, `#targetMinutes`) are strictly encapsulated using native ES private fields.
* **Defensive Copying and Accessors:** Methods such as `getLogs()` return clones (`[...this.#dates]`), preventing external mutations from bypassing domain validation rules.
* **Controlled Mutators:** Getters and setters enforce business rules and validate inputs against allowed domain invariants before state changes occur.

### 2. Inheritance and Class Specialization
* Implements class extension via `class TimedHabit extends Habit`.
* Reuses core lifecycle logic and log tracking from the base class while specializing behavior with time target constraints (`#targetMinutes`) and polymorphic display strings.

### 3. Polymorphism and Strategy Pattern
* Decouples streak calculation algorithms from the habit model into interchangeable strategy classes: `DailyStreakCalculator` and `WeeklyStreakCalculator`.
* Both implement a uniform contract: `.calculate(habit, logs, today)`. The habit model delegates calculation dynamically based on its configured frequency.

### 4. Abstraction and Static Factory Methods
* Exposes expressive static factory methods (`Habit.daily(name)`, `Habit.weekly(name)`, `TimedHabit.daily(name, minutes)`) to simplify instantiation and ensure consistent state initialization.

### 5. Domain Exception Handling
* Implements a custom error hierarchy (`class DomainError extends Error`) mapped against an enumeration dictionary (`ERROR_CODES`).
* Ensures validation failures produce typed domain errors rather than generic runtime failures.

---

## Enterprise Engineering Practices

### Zero-XSS Safe Rendering
* Eliminates dangerous `innerHTML` string interpolations for user-controlled input.
* Builds dynamic DOM trees using native DOM APIs (`document.createElement`, `replaceChildren`) and binds user text strictly via `textContent`, rendering script injection attempts impossible.

### Native HTML5 Templates
* Uses the HTML5 `<template id="streakCardTemplate">` element to define component markup directly in HTML rather than constructing HTML strings in JavaScript.
* JavaScript clones the template via `content.cloneNode(true)` and populates text nodes safely.

### Memory-Efficient Event Delegation
* Replaces repetitive per-element event listeners with an Event Delegation pattern on the `#habitsTable` container.
* A single centralized listener handles user interactions through event bubbling (`e.target.closest('.habit-checkbox')`), drastically reducing memory overhead.

### Client-Side State Persistence
* Incorporates a dedicated `StorageService` using `localStorage`.
* Implements explicit serialization methods (`toJSON()` / `fromJSON()`) on models, ensuring domain instances and their encapsulated states persist across page reloads.

### Native ES Modules
* Structured under standard ECMAScript modules (`import` / `export`) with `"type": "module"`, decoupling domain models, calculators, and services into modular, maintainable units.

---

## Key Features

* **Interactive Monthly Matrix:** Day-by-day habit calendar with real-time check-in toggling.
* **Streak Computation Engine:** Real-time streak tracking for daily and weekly frequencies with current-day grace period logic.
* **Session Persistence:** Retains habits and check-in history in `localStorage`.
* **Daily Motivational Quotes:** Rotational quotes to encourage user consistency.
* **Responsive Visuals:** Flexbox and CSS Grid layout with modal flows and status feedback toasts.

---

## Project Structure

```text
javascript-02-oop-habit-tracker/
├── src/
│   ├── models/
│   │   ├── DomainError.js          # Custom domain exceptions and error codes
│   │   ├── Habit.js                # Primary habit domain model
│   │   ├── TimedHabit.js           # Extended habit model with duration targets
│   │   ├── LogTracker.js           # Encapsulated check-in date tracker
│   │   └── StreakCalculators.js    # Daily and weekly streak calculation strategies
│   ├── services/
│   │   └── StorageService.js       # LocalStorage serialization and persistence
│   ├── index.html                  # Semantic markup with HTML5 component templates
│   ├── styles.css                  # CSS design tokens, card styles, and animations
│   ├── app.js                      # Application controller and event orchestrator
│   └── example.js                  # Paradigm benchmark references
├── package.json                    # Project configuration with native ES module support
├── .gitignore                      # Standardized git ignore rules
└── README.md                       # Project technical documentation
```

---

## Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18 or higher recommended)
* A modern web browser supporting ES2022+

### Installation and Local Execution
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
5. Open your browser and navigate to the address shown in the terminal (typically `http://127.0.0.1:8080`).

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Launches the hot-reloading development server using `live-server`. |
| `npm start` | Serves the `src/` directory over HTTP on port 8080 via `http-server`. |

---

## Author

**Ricardo Avila**
* GitHub: [@rikrd19](https://github.com/rikrd19)
* Repository: [javascript-02-oop-habit-tracker](https://github.com/rikrd19/javascript-02-oop-habit-tracker)

---
*All rights reserved © 2026*
