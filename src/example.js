// ==========================================
// JavaScript Paradigm Benchmark & Comparison
// ==========================================

// 1. Procedural Approach (Global variables + free functions)
// Problem: Shared mutable state without encapsulation, prone to unexpected side-effects
let proceduralBalance = 100;

function proceduralDeposit(amount) {
  proceduralBalance += amount;
}

function proceduralWithdraw(amount) {
  proceduralBalance -= amount;
}

proceduralWithdraw(1000);
console.log("1. Procedural balance:", proceduralBalance); // Output: -900

// ------------------------------------------

// 2. Object Literal Approach
// Advantage: Groups related state and behaviors together in a single structure
// Limitation: Cannot serve as a reusable blueprint to instantiate multiple distinct accounts
const literalAccount = {
  owner: "Felipe",
  balance: 100,

  deposit(amount) {
    if (amount <= 0) throw new Error("Deposit amount must be greater than zero");
    this.balance += amount;
    return this.balance;
  },

  withdraw(amount) {
    if (amount <= 0) throw new Error("Withdrawal amount must be greater than zero");
    if (amount > this.balance) throw new Error("Insufficient funds");
    this.balance -= amount;
    return this.balance;
  },
};

console.log("2. Literal initial:", literalAccount.balance); // Output: 100
literalAccount.deposit(50);
literalAccount.withdraw(70);
console.log("2. Literal final balance:", literalAccount.balance); // Output: 80

// ------------------------------------------

// 3. Constructor Function + Prototype Approach (ES5 Legacy OOP)
// Advantage: Enables multiple instances sharing memory-efficient methods via prototype chain
function PrototypeAccount(owner, initialBalance = 0) {
  this.owner = owner;
  this.balance = initialBalance;
}

PrototypeAccount.prototype.deposit = function (amount) {
  if (amount <= 0) throw new Error("Deposit amount must be greater than zero");
  this.balance += amount;
  return this.balance;
};

PrototypeAccount.prototype.withdraw = function (amount) {
  if (amount <= 0) throw new Error("Withdrawal amount must be greater than zero");
  if (amount > this.balance) throw new Error("Insufficient funds");
  this.balance -= amount;
  return this.balance;
};

const protoUser = new PrototypeAccount("María", 200);
protoUser.deposit(100);
console.log("3. Prototype final balance:", protoUser.balance); // Output: 300

// ------------------------------------------

// 4. Modern ES6+ Class Approach (Industry Standard)
// Advantage: Clean syntax, true private fields (#), robust domain validation and inheritance
class BankAccount {
  #balance;
  #owner;

  constructor(owner, initialBalance = 0) {
    this.#owner = owner;
    this.#balance = Math.max(0, initialBalance);
  }

  get balance() {
    return this.#balance;
  }

  get owner() {
    return this.#owner;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error("Deposit amount must be greater than zero");
    this.#balance += amount;
    return this.#balance;
  }

  withdraw(amount) {
    if (amount <= 0) throw new Error("Withdrawal amount must be greater than zero");
    if (amount > this.#balance) throw new Error("Insufficient funds");
    this.#balance -= amount;
    return this.#balance;
  }
}

const classUser = new BankAccount("Carlos", 500);
classUser.deposit(250);
console.log("4. ES6 Class final balance:", classUser.balance); // Output: 750
