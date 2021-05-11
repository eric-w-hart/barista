import { ApiProperty } from '@nestjs/swagger';

export class ScanBranchDto {
  @ApiProperty()
  branch: string;
}
