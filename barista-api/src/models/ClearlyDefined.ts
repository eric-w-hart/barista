import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { ModelBase } from './ModelBase';

@Entity()
@Index(['indentifier'])
export class ClearlyDefined extends ModelBase {
  @ApiModelProperty()
  @Column({ nullable: true })
  copyrights: string;

  @ApiModelProperty()
  @Column()
  indentifier: string;

  @ApiModelProperty()
  @Column({ nullable: true })
  license: string;

  @ApiModelProperty()
  @Column({ nullable: true })
  licensetext: string;

  @ApiModelProperty()
  @Column({ nullable: true })
  name: string;

  @ApiModelProperty()
  @Column({ nullable: true })
  uuid: string;

  @ApiModelProperty()
  @Column({ nullable: true })
  version: string;

  @ApiModelProperty()
  @Column({ nullable: true })
  website: string;
}
