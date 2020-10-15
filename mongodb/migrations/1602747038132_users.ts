import BaseMigration from '@ioc:Mongodb/Migration';

export default class UsersMigration extends BaseMigration {
  public up(): void {
    this.createIndex('users', 'email', { unique: true });
  }
}
