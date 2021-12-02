import BaseMigration from '@ioc:Zakodium/Mongodb/Migration';

export default class SampleMigration extends BaseMigration {
  public up(): void {
    this.createIndex('samples', 'uuid10', { unique: true });
  }
}
