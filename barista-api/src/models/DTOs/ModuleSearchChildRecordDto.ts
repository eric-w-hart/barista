import { ApiProperty } from '@nestjs/swagger';

export class ModuleSearchChildRecordDto {
  @ApiProperty()
  entityCreationDate: Date;

  @ApiProperty()
  entityName: string;

  @ApiProperty()
  projectId: number;
}
