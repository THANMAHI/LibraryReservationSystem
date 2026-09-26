import { Member, StandardMember, StudentMember, StaffMember } from './Member';

/**
 * Factory class responsible for creating different types of library members.
 */
export class MemberFactory {
  private static idCounter: number = 0;

  /**
   * Creates a new Member object based on the requested member type.
   * @param {string} type - The member type ('standard', 'student', or 'staff').
   * @param {string} name - The name of the member.
   * @returns {Member} The newly created Member instance.
   * @throws {Error} If an unsupported member type is provided.
   */
  public static createMember(type: string, name: string): Member {
    const id = `mem-${++MemberFactory.idCounter}-${Date.now().toString(36)}`;
    const normalizedType = type.toLowerCase().trim();

    switch (normalizedType) {
      case 'standard':
        return new StandardMember(id, name);
      case 'student':
        return new StudentMember(id, name);
      case 'staff':
        return new StaffMember(id, name);
      default:
        throw new Error(`Unknown member type: ${type}`);
    }
  }
}
