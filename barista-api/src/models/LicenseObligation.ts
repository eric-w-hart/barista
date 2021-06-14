import { ApiProperty } from '@nestjs/swagger';

export class LicenseObligation {
  @ApiProperty()
  licenseCode: string;

  @ApiProperty()
  obligationCode: string;
}
