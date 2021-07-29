import BaseMigration from '@ioc:Zakodium/Mongodb/Migration';

export default class UsersMigration extends BaseMigration {
  public up(): void {
    this.createIndex('users', 'emails', { unique: true });
  }
}
