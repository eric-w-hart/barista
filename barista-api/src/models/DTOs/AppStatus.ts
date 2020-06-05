import { ApiProperty } from '@nestjs/swagger';

export class AppStatus {
  @ApiProperty()
  appCommitHash: string;

  @ApiProperty()
  appEnvironment: string;

  @ApiProperty()
  appMetaData?: any;

  @ApiProperty()
  appName: string;

  @ApiProperty()
  appVersion: string;

  @ApiProperty()
  nodeEnv?: string;
}
