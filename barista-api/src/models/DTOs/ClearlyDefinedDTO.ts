import { ApiModelProperty } from '@nestjs/swagger';

export class ClearlyDefinedDTO {
  @ApiModelProperty()
  content: string;

  @ApiModelProperty()
  summary: string;
}
