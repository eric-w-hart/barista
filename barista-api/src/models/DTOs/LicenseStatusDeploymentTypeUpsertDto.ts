import { ApiProperty } from '@nestjs/swagger';

export class LicenseStatusDeploymentTypeUpsertDto {
  @ApiProperty()
  deploymentTypeCode: string;

  @ApiProperty()
  licenseCode: string;

  @ApiProperty()
  licenseFilter: string;

  @ApiProperty()
  scanStatusCode: string;
}
