import { UserRole } from '@app/models/User';
import { ApiProperty } from '@nestjs/swagger';

export class UserInfo {
  @ApiProperty()
  displayName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  groups: string[];

  @ApiProperty()
  id: string;

  @ApiProperty({
    enum: [UserRole.Admin, UserRole.Collaborator, UserRole.LicenseAdmin, UserRole.SecurityAdmin],
    type: UserRole,
  })
  role: UserRole;

  @ApiProperty()
  userName: string;
}
