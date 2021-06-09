import { ApiProperty } from '@nestjs/swagger';
import { ClearlyDefined } from '../ClearlyDefined';

export class ProjectDistinctLicenseAttributionDto {
  @ApiProperty()
  clearDefined: ClearlyDefined;

  @ApiProperty()
  license: any;

  @ApiProperty()
  licenselink: any;

  @ApiProperty()
  packageName: string;

  @ApiProperty()
  publisherName: any;

  @ApiProperty()
  publisherUrl: any;
}
