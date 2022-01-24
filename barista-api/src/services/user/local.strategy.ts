import { LdapService } from '@app/services/user/ldap.service';
import { UserService } from '@app/services/user/user.service';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService, private readonly ldapService: LdapService) {
    super();
  }
  logger = new Logger('LdapService');
  async validate(username: string, password: string): Promise<any> {
    let user: any = null;

    if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'test') {
      // If this is a test, let's go ahead and validate
      // TODO: Add a provision to allow for testing of negative login conditions
      user = {
        displayName: '',
        id: 0,
        role: 'test',
        userName: 'TestUser',
        groups: ['group1', 'group1', 'group3'],
      };
    } else if (process.env.AUTH_TYPE === 'ldap') {
      this.logger.log(`Ben - Before first validateuser`);
      user = await this.ldapService.validateUser(username, password, true);
      this.logger.log(`user = ` + JSON.stringify(user));
      this.logger.log(`Ben - After first validateuser`);
      // if (!user) {
      //   this.logger.log(`Ben - Before 2 validateuser`);
      //   user = await this.ldapService.validateUser(username, password, true);
      //   this.logger.log(`Ben - After f2 validateuser`);
      // }
      // if (user) {
      //   this.logger.log(`Ben - Before getgroups`);
      //   user.groups = await this.ldapService.getUserGroups(username, password);
      //   this.logger.log(`Ben - After getgroups`);
      // }
    } else {
      this.logger.log(`Ben - Before 3 validateuser`);
      user = await this.userService.validateUser(username, password);
      this.logger.log(`Ben - After 3 validateuser`);
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
