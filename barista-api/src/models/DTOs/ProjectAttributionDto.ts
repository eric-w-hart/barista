import { ApiModelProperty } from '@nestjs/swagger';

export class ProjectAttributionDto {
  @ApiModelProperty()
  licenseText: string;
}
