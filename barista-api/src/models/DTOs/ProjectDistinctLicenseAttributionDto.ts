import { ApiModelProperty } from '@nestjs/swagger';

export class ProjectDistinctLicenseAttributionDto {
  @ApiModelProperty()
  publisherName: any;

  @ApiModelProperty()
  publisherUrl: any;

  @ApiModelProperty()
  license: any;

  @ApiModelProperty()
  licenselink: any;
}
