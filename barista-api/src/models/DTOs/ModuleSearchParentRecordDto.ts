import { ApiProperty } from '@nestjs/swagger';

export class ModuleSearchParentRecordDto {
  @ApiProperty()
  entityCount: number;

  @ApiProperty()
  entityName: string;

  @ApiProperty()
  projectDescription: string;

  @ApiProperty()
  projectEmail: string;

  @ApiProperty()
  projectGitUrl: string;
  @ApiProperty()
  projectId: number;

  @ApiProperty()
  projectName: string;

  @ApiProperty()
  projectOwner: string;
}
