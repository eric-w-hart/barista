import { ApiProperty } from '@nestjs/swagger';

export class AuthJwtToken {
  @ApiProperty()
  accessToken: string;
}
