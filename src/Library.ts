import { Book } from './Book';
import { Member } from './Member';
import { MemberFactory } from './MemberFactory';

/**
 * Main Library class acting as a Facade to coordinate interactions between Books and Members.
 */
export class Library {
  public books: Book[];
  public members: Member[];

  /**
   * Constructs a new Library instance with empty collections of books and members.
   */
  constructor() {
    this.books = [];
    this.members = [];
  }

  /**
   * Adds a new book to the library collection.
   * @param {string} title - The title of the book to add.
   * @param {string} author - The author of the book.
   * @returns {Book} The created Book object.
   */
  public addBook(title: string, author: string): Book {
    const book = new Book(title, author);
    this.books.push(book);
    return book;
  }

  /**
   * Registers a new member in the library using the MemberFactory.
   * @param {string} name - The name of the member.
   * @param {string} type - The type of member ('standard', 'student', 'staff').
   * @returns {Member} The newly registered Member object.
   */
  public registerMember(name: string, type: string): Member {
    const member = MemberFactory.createMember(type, name);
    this.members.push(member);
    return member;
  }

  /**
   * Finds a book in the library collection by its title.
   * @param {string} title - The title of the book to search for.
   * @returns {Book | undefined} The Book object if found, or undefined.
   */
  public findBook(title: string): Book | undefined {
    return this.books.find(b => b.title.toLowerCase() === title.toLowerCase());
  }

  /**
   * Finds a member in the library collection by ID or name.
   * @param {string} id - The ID or name of the member to search for.
   * @returns {Member | undefined} The Member object if found, or undefined.
   */
  public findMember(id: string): Member | undefined {
    return this.members.find(m => m.id === id || m.name === id);
  }

  /**
   * Reserves a book for a given member.
   * @param {string} memberId - The ID or name of the member reserving the book.
   * @param {string} bookTitle - The title of the book to reserve.
   * @throws {Error} If the member or book is not found.
   * @throws {Error} If the member has reached their reservation limit.
   */
  public reserveBook(memberId: string, bookTitle: string): void {
    const member = this.findMember(memberId);
    if (!member) {
      throw new Error(`Member with ID/name "${memberId}" not found.`);
    }

    const book = this.findBook(bookTitle);
    if (!book) {
      throw new Error(`Book with title "${bookTitle}" not found.`);
    }

    if (member.currentReservations.length >= member.borrowingLimit) {
      throw new Error('Reservation limit reached');
    }

    if (!book.isReserved) {
      book.reserve(member.id);
      member.currentReservations.push(book.title);
    } else {
      book.addToWaitlist(member);
    }
  }

  /**
   * Returns a book to the library, notifying waitlisted members and automatically reserving it for the next member in FIFO order.
   * @param {string} bookTitle - The title of the book being returned.
   * @throws {Error} If the book is not found.
   */
  public returnBook(bookTitle: string): void {
    const book = this.findBook(bookTitle);
    if (!book) {
      throw new Error(`Book with title "${bookTitle}" not found.`);
    }

    // Remove reservation from current holder if exists
    if (book.reservedBy) {
      const currentHolder = this.members.find(m => m.id === book.reservedBy);
      if (currentHolder) {
        currentHolder.currentReservations = currentHolder.currentReservations.filter(
          title => title.toLowerCase() !== bookTitle.toLowerCase()
        );
      }
    }

    book.returnBook();

    // Notify all members on waitlist (observers)
    book.notifyObservers();

    // Assign to next member on waitlist on FIFO basis
    if (book.waitlist.length > 0) {
      const nextMember = book.waitlist.shift()!;
      book.reserve(nextMember.id);
      nextMember.currentReservations.push(book.title);
    }
  }

  /**
   * Calculates the overdue fine for a given reservation at a fixed rate of $0.50 per day.
   * @param {Object} reservation - Reservation object containing a dueDate property.
   * @param {Date} reservation.dueDate - The date the book was due.
   * @param {Date} [reservation.returnDate] - Optional return date; defaults to current date if not provided.
   * @returns {number} The total fine amount in dollars.
   */
  public calculateFine(reservation: { dueDate: Date; returnDate?: Date }): number {
    const DAILY_FINE_RATE = 0.50;
    if (!reservation || !reservation.dueDate) {
      return 0;
    }

    const now = reservation.returnDate ? new Date(reservation.returnDate) : new Date();
    const dueDate = new Date(reservation.dueDate);

    const diffInTime = now.getTime() - dueDate.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

    return diffInDays > 0 ? diffInDays * DAILY_FINE_RATE : 0;
  }
}
