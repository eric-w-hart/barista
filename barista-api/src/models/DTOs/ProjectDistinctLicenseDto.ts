import { ApiProperty } from '@nestjs/swagger';

export class ProjectDistinctLicenseDto {
  @ApiProperty()
  count: number;

  @ApiProperty()
  license: any;
}
