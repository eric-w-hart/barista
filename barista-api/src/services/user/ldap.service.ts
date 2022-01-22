import { UserRole } from '@app/models/User';
import { ProjectService } from '@app/services/project/project.service';
import { ImATeapotException, Injectable, Logger } from '@nestjs/common';
import * as _ from 'lodash';
import LdapClient from 'promised-ldap';
import { UserInfo } from '../../models/DTOs';

@Injectable()
export class LdapService {
  constructor(private projectService: ProjectService) {
    this.ldapConfig = {
      url: process.env.LDAP_SERVER,
      base: process.env.LDAP_BASE,
      group: process.env.LDAP_GROUP || 'barista_collaborators',
      adminGroup: process.env.LDAP_ADMIN_GROUP || 'barista_admin',
      licenseAdminGroup: process.env.LDAP_LICENSE_ADMIN_GROUP || 'barista_license_admin',
      securityAdminGroup: process.env.LDAP_SECURITY_ADMIN_GROUP || 'barista_security_admin',
    };
  }

  ldapConfig: any;
  logger = new Logger('LdapService');

  createLdapClient(): LdapClient {
    return new LdapClient({
      url: this.ldapConfig.url,
      tlsOptions: { rejectUnauthorized: false },
      connectionTimeout: 10000,
    });
  }

  async getUserGroups(userName: string, pass: string): Promise<string[]> {
    this.logger.log(`Ben - Starting get groups`);
    const ldapClient = this.createLdapClient();
    const searchUser = `cn=${userName},${this.ldapConfig.base}`;
    this.logger.log(`Ben - After createldapclient`);
    let l;
    try {
      l = ldapClient
        .bind(searchUser, pass)
        .then(async () => {
          this.logger.log(`Ben - inside 1 then`);
          return await ldapClient
            .search(searchUser, {
              scope: 'sub',
              filter: `(&(objectClass=user)(sAMAccountName=${userName}))`,
              attributes: ['cn', 'displayName', 'givenName', 'sn', 'mail', 'group', 'gn', 'memberOf'],
            })
            .then(async (result) => {
              this.logger.log(`Ben - inside 2 then`);
              try {
                if (_.isEmpty(result.entries)) {
                  // not a primary account
                  this.logger.warn(`User ${userName} doesn't belong to any groups.`);
                  return [];
                }

                const memberOf = result.entries[0].object.memberOf;

                if (memberOf) {
                  this.logger.log(`Ben - inside memberof if`);
                  const groups = memberOf
                    .map((g) => g.split(',')[0])
                    .map((s) => s.replace(/(.*)=(.*)/, '$2'))
                    .map((group) => group.toLowerCase());
                  this.logger.log(`Ben - before distinctuserides`);
                  const baristaGroups = await this.projectService.distinctUserIds();
                  this.logger.log(`Ben - after distinctuserides`);

                  this.logger.log(`Ben - before ba`);
                  const ba = baristaGroups.map((g) => g.project_userId);
                  this.logger.log(`Ben - after ba`);
                  this.logger.log(`Ben - before intersection`);
                  const intersection = groups.filter((element) =>
                    baristaGroups.map((g) => g.project_userId).includes(element),
                  );
                  this.logger.log(`Ben - after intersection`);
                  this.logger.log(`User ${userName} is member of the following barista groups: ${intersection}`);
                  return intersection;

                  // return baristaGroups;
                }
                return [];
              } finally {
                ldapClient.unbind();
              }
            });
        })
        .catch((e) => {
          this.logger.error(`AD Groups query error: ${e}`);
          return null;
        });
    } catch (e) {
      this.logger.error(`bind  ${e}`);
    }
    return l;
  }

  getUserRole(groups: string[]): UserRole {
    if (_.findIndex(groups, (group) => group.startsWith('CN=' + this.ldapConfig.adminGroup)) !== -1) {
      return UserRole.Admin;
    }

    if (_.findIndex(groups, (group) => group.startsWith('CN=' + this.ldapConfig.licenseAdminGroup)) !== -1) {
      return UserRole.LicenseAdmin;
    }

    if (_.findIndex(groups, (group) => group.startsWith('CN=' + this.ldapConfig.securityAdminGroup)) !== -1) {
      return UserRole.SecurityAdmin;
    }

    return UserRole.Collaborator;
  }

  validateUser(userName: string, pass: string, applyFilter: boolean): Promise<UserInfo> {
    const client = this.createLdapClient();

    const searchUser = `cn=${userName},${this.ldapConfig.base}`;
    const adGroups = [
      this.ldapConfig.adminGroup,
      this.ldapConfig.licenseAdminGroup,
      this.ldapConfig.securityAdminGroup,
      this.ldapConfig.group,
    ];

    // const adGroupsFilter =
    //   '(|' + adGroups.map((group) => `(memberOf=CN=${group},${this.ldapConfig.base})`).join('') + ')';
    return client
      .bind(searchUser, pass)
      .then(() => {
        return client
          .search(searchUser, {
            scope: 'sub',
            filter: `(&(objectClass=user)(sAMAccountName=${userName}))`,
            attributes: ['cn', 'displayName', 'givenName', 'sn', 'mail', 'group', 'gn', 'memberOf'],
          })
          .then((result) => {
            try {
              if (_.isEmpty(result.entries)) {
                // not a primary account
                this.logger.warn(`User ${userName} doesn't belong to any groups.`);
                // ImATeapot is a placeholder for now
                throw new ImATeapotException('Required group membership is not present');
                return null;
              }

              const memberOf = result.entries[0].object.memberOf;

              // Only look at the first response
              const entry = result.entries[0].object;
              const userInfo: UserInfo = {
                id: entry.cn,
                displayName: entry.displayName,
                userName,
                role: this.getUserRole(memberOf),
                email: entry.mail,
                groups: [],
              };

              return userInfo;
            } finally {
              client.unbind();
            }
          });
      })
      .catch((e) => {
        this.logger.error(`AD query error: ${e}`);
        if (applyFilter) {
          // ImATeapot is a placeholder for now
          throw new ImATeapotException('Invalid Username or Password');
        }
        return null;
      });
  }
}
