import { DepClientBaseService } from '@app/default-scan/dep-clients/common/dep-client-base/dep-client-base.service';
import { PackageManagerEnum } from '@app/models/PackageManager';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GolangService extends DepClientBaseService {
  constructor() {
    super();
  }
  logger = new Logger('GolangService');
  packageManagerCode = PackageManagerEnum.GOLANG;

  async command(workingDir: string, options?: any): Promise<string> {
    // Create a GOPATH directory .go under the cloned git repository

    const goPath = `${workingDir}/.go`;

    const command = `mkdir -p ${goPath} && GOPATH=${goPath} go install`;

    return command;
  }
}
