import { DepClientBaseService } from '@app/default-scan/dep-clients/common/dep-client-base/dep-client-base.service';
import { SystemConfiguration } from '@app/models';
import { PackageManagerEnum } from '@app/models/PackageManager';
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class NpmService extends DepClientBaseService {
  constructor() {
    super();
  }
  logger = new Logger('NPMService');
  packageManagerCode = PackageManagerEnum.NPM;

  async command(workingDir: string, options?: any): Promise<string> {
    const config = await SystemConfiguration.defaultConfiguration();

    let command = `NODE_ENV=production `;

    const packageLock = path.join(workingDir, 'package-lock.json');
    if (fs.existsSync(packageLock)) {
      command = `${command} && yarn import && rm ./package-lock.json `;
    }
    // if (config.npmRegistry) {
    //   command = `${command} && sed 's,https://registry.yarnpkg.com,${config.npmRegistry},g' ./yarn.lock `;
    // }
    const homeNpmrc = path.join(process.env.HOME, '.npmrc');
    if (fs.existsSync(homeNpmrc)) {
      this.logger.debug(
        `.npmrc found at ${homeNpmrc}, ignoring the configuration value at SystemConfiguration.defaultConfiguration().npmRegistry`,
      );
    } else {
      // If we don't have an .npmrc in our home directory
      // And if a registry has been configured, then let's set it here...
      if (config.npmRegistry) {
        command = `npm config set registry ${config.npmRegistry} && ${command}`;
      }
    }
    command = `${command} && yarn install --ignore-scripts`;
    // If we are running on a real server (not development)
    // and a cache from the system config directory exists
    // then let's use it for the NPM cache.
    // TODO: Make this path cross platform compatible
    if (config.npmCacheDirectory && fs.existsSync(config.npmCacheDirectory)) {
      const cacheSubDirectory = path.join(config.npmCacheDirectory, '.npm');
      if (!fs.existsSync(cacheSubDirectory)) {
        fs.mkdirSync(cacheSubDirectory);
      }
      command = `${command} --cache ${config.npmCacheDirectory} `;
    }

    return command;
  }
}
