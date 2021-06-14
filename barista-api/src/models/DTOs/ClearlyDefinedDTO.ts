import { ApiProperty } from '@nestjs/swagger';

export class ClearlyDefinedDTO {
  @ApiProperty()
  content: {
    packages: [
      {
        uuid: string;
        name: string;
        version: string;
        website: string;
        license: string;
        text: string;
        copyrights: [];
      },
    ];
  };
}
