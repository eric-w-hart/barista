import { ApiProperty } from '@nestjs/swagger';

export class EntityCodeAndRelationFilterDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  filter: string;
}
