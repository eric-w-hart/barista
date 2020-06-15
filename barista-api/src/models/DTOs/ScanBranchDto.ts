import { ApiModelProperty } from '@nestjs/swagger';

export class ScanBranchDto {
  @ApiModelProperty()
  branch: string;
}
