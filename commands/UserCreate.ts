import { BaseCommand } from '@adonisjs/core/build/standalone';

export default class CreateUser extends BaseCommand {
  public static commandName = 'user:create';
  public static description = 'Create an user';

  public static settings = {
    loadApp: true,
  };

  public async run() {
    const { default: Credential } = await import('App/Models/Credential');
    const { default: User } = await import('App/Models/User');
    const { default: Hash } = await import('@ioc:Adonis/Core/Hash');

    const firstname = await this.prompt.ask('Enter firstname');
    const lastname = await this.prompt.ask('Enter lastname');
    const email = await this.prompt.ask('Enter email');
    const password = await this.prompt.secure('Choose account password');
    const userType = await this.prompt.choice('Select account type', [
      {
        name: 'ADMIN',
        message: 'Admin (Complete access)',
      },
      {
        name: 'MEMBER',
        message: 'Member',
      },
    ]);

    const credential = new Credential();
    credential.email = email;
    credential.hash = await Hash.make(password);
    try {
      await credential.save();
    } catch (err) {
      this.logger.error('Failed to save new credential');
      await this.exit();
    }

    const user = new User();
    user.emails = [email];
    user.firstName = firstname;
    user.lastName = lastname;
    user.role = userType;
    user.authMethods = {
      local: credential.id.toHexString(),
    };
    try {
      await user.save();
    } catch (err) {
      this.logger.error('Failed to save new user');
      await this.exit();
    }

    this.logger.success('User created');
  }
}
