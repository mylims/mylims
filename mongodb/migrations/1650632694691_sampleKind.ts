import BaseMigration from '@ioc:Zakodium/Mongodb/Migration';

export default class SampleKindMigration extends BaseMigration {
  public up(): void {
    this.createIndex('samples', 'kind');
  }
}
