import { ApiProperty } from '@nestjs/swagger';

export class JobInfoDto {
  @ApiProperty()
  attemptsMade: number;

  @ApiProperty()
  data: {
    scanId?: number;
  };

  @ApiProperty()
  delay: number;

  @ApiProperty()
  finishedOn: any;

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  opts: {
    attempts: number;
    delay: number;
    timestamp: number;
  };

  @ApiProperty()
  processedOn: any;

  @ApiProperty()
  progress: number;

  @ApiProperty()
  returnvalue: any;

  @ApiProperty()
  stacktrace: any[];

  @ApiProperty()
  timestamp: number;
}
