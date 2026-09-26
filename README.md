# Library Reservation System (OOP & Design Patterns)

An Object-Oriented Library Reservation System built in **TypeScript** using **Factory** and **Observer** design patterns, accompanied by unit testing using **Jest** and containerization with **Docker**.

---

## System Architecture & Design Patterns

### Core Class Diagram & Structure
```
src/
├── Book.ts           # Subject in Observer Pattern & Book Domain Entity
├── Member.ts         # Observers (StandardMember, StudentMember, StaffMember)
├── MemberFactory.ts  # Factory Pattern for creating Member instances
└── Library.ts        # Central Facade coordinating Library operations
tests/
└── Library.test.ts   # Comprehensive Jest Unit Tests
```

### Key Design Patterns Implemented
1. **Factory Pattern (`MemberFactory`)**:
   - Encapsulates creation logic for different member types.
   - Assigns unique IDs and specific borrowing limits:
     - **Standard Member (`'standard'`)**: Borrowing limit = 3
     - **Student Member (`'student'`)**: Borrowing limit = 5
     - **Staff Member (`'staff'`)**: Borrowing limit = 10

2. **Observer Pattern (`Book` & `Member`)**:
   - `Book` acts as the **Subject**, maintaining a waitlist of `Member` **Observers**.
   - When a reserved book is returned, all waitlisted members are notified automatically via console standard output:
     `Notification for [Member Name]: The book "[Book Title]" is now available.`
   - Waitlist operates on a strict **First-In, First-Out (FIFO)** basis; the first waitlisted member automatically receives the next reservation upon return.

3. **Facade Pattern (`Library`)**:
   - Serves as a single unified entry point for all operations: member registration, book creation, reservations, returns, waitlist notifications, and overdue fine calculations.

---

## Overdue Fine Calculation
- Fixed rate: **$0.50 per day overdue**.
- Calculated by determining the difference between the return date (or current date) and the reservation's due date.

---

## Setup & Execution Instructions

### Prerequisites
- Node.js (v18+)
- npm
- Docker (optional for containerized execution)

### 1. Local Setup
```bash
# Install dependencies
npm install

# Build TypeScript code
npm run build

# Run unit tests
npm test
```

### 2. Running with Docker
```bash
# Build Docker image
docker build -t library-reservation-system .

# Run container (executes test suite by default)
docker run --rm library-reservation-system

# Alternatively, using Docker Compose
docker-compose up --build
```

---

## Unit Testing
The test suite in `tests/Library.test.ts` verifies:
- Member creation & borrowing limit initialization.
- Enforcement of reservation limits (`Reservation limit reached`).
- Waitlist notification format & FIFO re-assignment on return.
- Fine calculation accuracy ($0.50 per overdue day).
- Full facade operations (`addBook`, `registerMember`, `findBook`, `findMember`).

---

## License
ISC
