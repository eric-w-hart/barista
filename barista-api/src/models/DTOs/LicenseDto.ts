import { ApiProperty } from '@nestjs/swagger';

export class LicenseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  modulesCount: number;

  @ApiProperty()
  name: string;
}
