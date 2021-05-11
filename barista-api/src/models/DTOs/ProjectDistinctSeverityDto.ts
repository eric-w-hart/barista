import { ApiProperty } from '@nestjs/swagger';

export class ProjectDistinctSeverityDto {
  @ApiProperty()
  count: number;

  @ApiProperty()
  severity: string;
}
