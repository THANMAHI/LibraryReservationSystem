import { Member } from './Member';

/**
 * Represents a book in the library system acting as a Subject in the Observer pattern.
 */
export class Book {
  public title: string;
  public author: string;
  public isReserved: boolean;
  public reservedBy: string | null;
  public waitlist: Member[];

  /**
   * Creates an instance of a Book.
   * @param {string} title - The title of the book.
   * @param {string} author - The author of the book.
   */
  constructor(title: string, author: string) {
    this.title = title;
    this.author = author;
    this.isReserved = false;
    this.reservedBy = null;
    this.waitlist = [];
  }

  /**
   * Reserves the book for a specified member ID.
   * @param {string} [memberId] - The ID of the member reserving the book.
   */
  public reserve(memberId?: string): void {
    this.isReserved = true;
    if (memberId) {
      this.reservedBy = memberId;
    }
  }

  /**
   * Marks the book as returned and no longer reserved.
   */
  public returnBook(): void {
    this.isReserved = false;
    this.reservedBy = null;
  }

  /**
   * Adds a member to the book's waitlist.
   * @param {Member} member - The member joining the waitlist.
   */
  public addToWaitlist(member: Member): void {
    if (!this.waitlist.some(m => m.id === member.id)) {
      this.waitlist.push(member);
    }
  }

  /**
   * Removes a member from the book's waitlist.
   * @param {Member} member - The member to remove from the waitlist.
   */
  public removeFromWaitlist(member: Member): void {
    this.waitlist = this.waitlist.filter(m => m.id !== member.id);
  }

  /**
   * Notifies all waitlisted members (observers) that the book is now available.
   */
  public notifyObservers(): void {
    for (const member of this.waitlist) {
      member.update(this);
    }
  }
}
