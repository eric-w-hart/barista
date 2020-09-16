import { ApiModelProperty } from '@nestjs/swagger';
import { ClearlyDefined } from '../ClearlyDefined';

export class ProjectDistinctLicenseAttributionDto {
  @ApiModelProperty()
  clearDefined: ClearlyDefined;

  @ApiModelProperty()
  license: any;

  @ApiModelProperty()
  licenselink: any;

  @ApiModelProperty()
  packageName: string;

  @ApiModelProperty()
  publisherName: any;

  @ApiModelProperty()
  publisherUrl: any;
}
