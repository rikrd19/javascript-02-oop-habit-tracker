let balance = 100;

function deposit(amount) {
  balance += amount;
}

function withdraw(amount) {
  balance -= amount;
}

withdraw(1000);
console.log(balance); // Output: -900

// Objects literal approach
const account = {
  owner: "Felipe",
  balance: 100,
  
  deposit(amount) {
    if (amount <= 0) throw new Error("El monto debe ser mayor que cero");
    this.balance += amount;
    return this.balance;
  },

  withdraw(amount) {
    if (amount <= 0) throw new Error("El monto debe ser mayor que cero");
    if (amount > this.balance) throw new Error("Fondos insuficientes");
    this.balance -= amount;
    return this.balance;
  },
};

console.log(account.balance); // Output: 100
account.deposit(50); // Output: 150
account.withdraw(70); // Output: 80
console.log(account.balance); // Output: 80
