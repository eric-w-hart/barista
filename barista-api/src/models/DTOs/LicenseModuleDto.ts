import { ApiProperty } from '@nestjs/swagger';

export class LicenseModuleDto {
  @ApiProperty()
  licenseScanResultItemId: number;

  @ApiProperty()
  modulePath: string;

  @ApiProperty()
  publisherEmail: string;

  @ApiProperty()
  publisherName: string;

  @ApiProperty()
  publisherUrl: string;

  @ApiProperty()
  scanCode: string;
}
