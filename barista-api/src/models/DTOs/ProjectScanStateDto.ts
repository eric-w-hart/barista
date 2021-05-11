import { ProjectScanStatusType } from '@app/models';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectScanStateDto {
  @ApiProperty({ type: type => ProjectScanStatusType })
  licenseStatus: ProjectScanStatusType;

  @ApiProperty()
  projectId: number;

  @ApiProperty({ type: type => ProjectScanStatusType })
  securityStatus: ProjectScanStatusType;
}
