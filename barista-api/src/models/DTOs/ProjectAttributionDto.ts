import { ApiProperty } from '@nestjs/swagger';

export class ProjectAttributionDto {
  @ApiProperty()
  licenseText: string;
}
