import BaseMigration from '@ioc:Zakodium/Mongodb/Migration';

export default class CredentialsMigration extends BaseMigration {
  public up(): void {
    this.createIndex('credentials', 'email', { unique: true });
  }
}
