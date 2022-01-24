import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import { LdapService } from '@app/services/user/ldap.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from '@app/services/user/user.service';

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
      this.logger.log("Before the first validateUser");
      user = await this.ldapService.validateUser(username, password, false);
      this.logger.log("After the first validateUser");
      if (!user) {
        this.logger.log("Before the second validateUser");
        user = await this.ldapService.validateUser(username, password, true);
        this.logger.log("After the second validateUser");
      }
      // if (user) {
      //   user.groups = await this.ldapService.getUserGroups(username, password);
      // }
    } else {
      user = await this.userService.validateUser(username, password);
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
