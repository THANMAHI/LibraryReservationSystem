import { Library } from '../src/Library';
import { Book } from '../src/Book';
import { MemberFactory } from '../src/MemberFactory';

describe('Library Reservation System Unit Tests', () => {
  let library: Library;

  beforeEach(() => {
    library = new Library();
  });

  describe('Requirement 1 & 9: Book Class', () => {
    test('should instantiate Book with correct title, author, and default state', () => {
      const myBook = new Book('1984', 'George Orwell');
      expect(myBook.title).toBe('1984');
      expect(myBook.author).toBe('George Orwell');
      expect(myBook.isReserved).toBe(false);
      expect(myBook.reservedBy).toBeNull();
      expect(myBook.waitlist).toEqual([]);

      myBook.reserve('member-123');
      expect(myBook.isReserved).toBe(true);
      expect(myBook.reservedBy).toBe('member-123');

      myBook.returnBook();
      expect(myBook.isReserved).toBe(false);
      expect(myBook.reservedBy).toBeNull();
    });
  });

  describe('Requirement 2: MemberFactory', () => {
    test('should create members with correct borrowing limits', () => {
      const student = MemberFactory.createMember('student', 'Ada Lovelace');
      expect(student.name).toBe('Ada Lovelace');
      expect(student.type).toBe('student');
      expect(student.borrowingLimit).toBe(5);
      expect(student.id).toBeDefined();

      const standard = MemberFactory.createMember('standard', 'John Doe');
      expect(standard.type).toBe('standard');
      expect(standard.borrowingLimit).toBe(3);

      const staff = MemberFactory.createMember('staff', 'Dr. Smith');
      expect(staff.type).toBe('staff');
      expect(staff.borrowingLimit).toBe(10);
    });

    test('should throw an error for unsupported member types', () => {
      expect(() => MemberFactory.createMember('invalid_type', 'Unknown')).toThrow();
    });
  });

  describe('Requirement 3: Borrowing Limit Enforcement', () => {
    test('should enforce reservation limits for a standard member (limit of 3)', () => {
      const member = library.registerMember('Alice', 'standard');
      library.addBook('Book 1', 'Author A');
      library.addBook('Book 2', 'Author B');
      library.addBook('Book 3', 'Author C');
      library.addBook('Book 4', 'Author D');

      library.reserveBook(member.id, 'Book 1');
      library.reserveBook(member.id, 'Book 2');
      library.reserveBook(member.id, 'Book 3');

      expect(() => {
        library.reserveBook(member.id, 'Book 4');
      }).toThrow('Reservation limit reached');
    });
  });

  describe('Requirement 4: Observer Pattern Waitlist Notifications', () => {
    test('should log notifications for all waitlisted members when a book is returned', () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      library.addBook('The Hobbit', 'J.R.R. Tolkien');
      const owner = library.registerMember('Owner', 'standard');
      const alice = library.registerMember('Alice', 'standard');
      const bob = library.registerMember('Bob', 'standard');

      library.reserveBook(owner.id, 'The Hobbit');
      library.reserveBook(alice.id, 'The Hobbit');
      library.reserveBook(bob.id, 'The Hobbit');

      library.returnBook('The Hobbit');

      expect(logSpy).toHaveBeenCalledWith(
        'Notification for Alice: The book "The Hobbit" is now available.'
      );
      expect(logSpy).toHaveBeenCalledWith(
        'Notification for Bob: The book "The Hobbit" is now available.'
      );

      logSpy.mockRestore();
    });
  });

  describe('Requirement 5: FIFO Waitlist Behavior', () => {
    test('should reassign reservation to the first waitlisted member in FIFO order', () => {
      library.addBook('Dune', 'Frank Herbert');
      const charlie = library.registerMember('Charlie', 'standard');
      const dave = library.registerMember('Dave', 'standard');
      const eve = library.registerMember('Eve', 'standard');

      library.reserveBook(charlie.id, 'Dune');
      library.reserveBook(dave.id, 'Dune');
      library.reserveBook(eve.id, 'Dune');

      const duneBook = library.findBook('Dune')!;
      expect(duneBook.waitlist.map(m => m.name)).toEqual(['Dave', 'Eve']);

      library.returnBook('Dune');

      expect(duneBook.isReserved).toBe(true);
      expect(duneBook.reservedBy).toBe(dave.id);
      expect(duneBook.waitlist.length).toBe(1);
      expect(duneBook.waitlist[0].name).toBe('Eve');
    });
  });

  describe('Requirement 6: Overdue Fine Calculation', () => {
    test('should calculate fine at $0.50 per day overdue', () => {
      const currentDate = new Date();
      const tenDaysAgo = new Date(currentDate.getTime() - 10 * 24 * 60 * 60 * 1000);

      const reservation = {
        dueDate: tenDaysAgo,
        returnDate: currentDate
      };

      const fine = library.calculateFine(reservation);
      expect(fine).toBe(5); // 10 days * 0.50 = 5.00
    });
  });

  describe('Requirement 10: Library Facade Methods', () => {
    test('should add and find books correctly', () => {
      library.addBook('Foundation', 'Isaac Asimov');

      const book = library.findBook('Foundation');
      expect(book).toBeDefined();
      expect(book?.title).toBe('Foundation');
      expect(book?.author).toBe('Isaac Asimov');

      const nonExistent = library.findBook('Non-Existent Book');
      expect(nonExistent).toBeUndefined();
    });

    test('should register and find members correctly', () => {
      const member = library.registerMember('Grace Hopper', 'staff');

      const foundById = library.findMember(member.id);
      expect(foundById).toBeDefined();
      expect(foundById?.name).toBe('Grace Hopper');

      const foundByName = library.findMember('Grace Hopper');
      expect(foundByName).toBeDefined();

      const nonExistent = library.findMember('unknown-id');
      expect(nonExistent).toBeUndefined();
    });
  });
});
