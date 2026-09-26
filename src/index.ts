import { Library } from './Library';

console.log('=== Library Reservation System Live Demo ===\n');

const library = new Library();

// 1. Add Books
console.log('1. Adding Books...');
library.addBook('The Hobbit', 'J.R.R. Tolkien');
library.addBook('Dune', 'Frank Herbert');
library.addBook('1984', 'George Orwell');
library.addBook('Foundation', 'Isaac Asimov');
console.log('Books added successfully.\n');

// 2. Register Members using MemberFactory
console.log('2. Registering Members...');
const alice = library.registerMember('Alice', 'student'); // Limit: 5
const bob = library.registerMember('Bob', 'standard');     // Limit: 3
const charlie = library.registerMember('Charlie', 'staff'); // Limit: 10
console.log(`Registered: ${alice.name} (${alice.type}, limit: ${alice.borrowingLimit})`);
console.log(`Registered: ${bob.name} (${bob.type}, limit: ${bob.borrowingLimit})`);
console.log(`Registered: ${charlie.name} (${charlie.type}, limit: ${charlie.borrowingLimit})\n`);

// 3. Demonstrate Reservations & Observer Pattern (Waitlist Notifications)
console.log('3. Reserving "The Hobbit" for Alice...');
library.reserveBook(alice.id, 'The Hobbit');

console.log('Adding Bob to "The Hobbit" waitlist...');
library.reserveBook(bob.id, 'The Hobbit');

console.log('Adding Charlie to "The Hobbit" waitlist...');
library.reserveBook(charlie.id, 'The Hobbit');

console.log('\nReturning "The Hobbit" (Triggers Observer Notifications & FIFO Assignment):');
library.returnBook('The Hobbit');
console.log('');

// 4. Demonstrate Borrowing Limit Enforcement
console.log('4. Demonstrating Borrowing Limit Enforcement for Standard Member (Limit: 3)...');
library.addBook('Book 1', 'Author A');
library.addBook('Book 2', 'Author B');
library.addBook('Book 3', 'Author C');
library.addBook('Book 4', 'Author D');

library.reserveBook(bob.id, 'Book 1');
library.reserveBook(bob.id, 'Book 2');

try {
  library.reserveBook(bob.id, 'Book 4'); // 4th reservation for Bob (since Bob has "The Hobbit" assigned + Book 1 + Book 2 = 3)
} catch (error: any) {
  console.log(`Successfully caught expected error: "${error.message}"\n`);
}

// 5. Demonstrate Overdue Fine Calculation
console.log('5. Fine Calculation Demo ($0.50 / day overdue):');
const pastDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 days ago
const fine = library.calculateFine({ dueDate: pastDate });
console.log(`Calculated fine for 10 days overdue: $${fine.toFixed(2)}\n`);

console.log('=== Demo Completed Successfully ===');
