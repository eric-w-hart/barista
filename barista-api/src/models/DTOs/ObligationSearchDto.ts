import { ApiProperty } from '@nestjs/swagger';

export class ObligationSearchDto {
  @ApiProperty()
  code: string;
  @ApiProperty()
  desc: string;
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
}
