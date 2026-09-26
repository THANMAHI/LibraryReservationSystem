import { Book } from './Book';

/**
 * Represents a generic library member.
 */
export abstract class Member {
  public id: string;
  public name: string;
  public type: string;
  public borrowingLimit: number;
  public currentReservations: string[];

  /**
   * Creates an instance of Member.
   * @param {string} id - Unique identifier for the member.
   * @param {string} name - Full name of the member.
   * @param {string} type - Member category ('standard', 'student', 'staff').
   * @param {number} borrowingLimit - Maximum number of books the member can reserve.
   */
  constructor(id: string, name: string, type: string, borrowingLimit: number) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.borrowingLimit = borrowingLimit;
    this.currentReservations = [];
  }

  /**
   * Observer callback method to notify the member when a waitlisted book becomes available.
   * @param {Book} book - The book that has become available.
   */
  public update(book: Book): void {
    console.log(`Notification for ${this.name}: The book "${book.title}" is now available.`);
  }
}

/**
 * Standard member with a borrowing limit of 3.
 */
export class StandardMember extends Member {
  constructor(id: string, name: string) {
    super(id, name, 'standard', 3);
  }
}

/**
 * Student member with a borrowing limit of 5.
 */
export class StudentMember extends Member {
  constructor(id: string, name: string) {
    super(id, name, 'student', 5);
  }
}

/**
 * Staff member with a borrowing limit of 10.
 */
export class StaffMember extends Member {
  constructor(id: string, name: string) {
    super(id, name, 'staff', 10);
  }
}
