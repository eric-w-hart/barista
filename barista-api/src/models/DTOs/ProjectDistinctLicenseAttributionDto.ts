import { ApiModelProperty } from '@nestjs/swagger';
import { ClearlyDefined } from '../ClearlyDefined';

export class ProjectDistinctLicenseAttributionDto {
  @ApiModelProperty()
  packageName: string;

  @ApiModelProperty()
  publisherName: any;

  @ApiModelProperty()
  publisherUrl: any;

  @ApiModelProperty()
  license: any;

  @ApiModelProperty()
  licenselink: any;

  @ApiModelProperty()
  clearDefined: ClearlyDefined;
}
