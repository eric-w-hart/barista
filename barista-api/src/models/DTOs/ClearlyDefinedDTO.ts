import { ApiModelProperty } from '@nestjs/swagger';

export class ClearlyDefinedDTO {
  @ApiModelProperty()
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
