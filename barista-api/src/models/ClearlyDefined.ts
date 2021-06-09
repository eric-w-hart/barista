import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { ModelBase } from './ModelBase';

@Entity()
@Index(['indentifier'])
export class ClearlyDefined extends ModelBase {
  @ApiProperty()
  @Column({ nullable: true })
  copyrights: string;

  @ApiProperty()
  @Column()
  indentifier: string;

  @ApiProperty()
  @Column({ nullable: true })
  license: string;

  @ApiProperty()
  @Column({ nullable: true })
  licensetext: string;

  @ApiProperty()
  @Column({ nullable: true })
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  uuid: string;

  @ApiProperty()
  @Column({ nullable: true })
  version: string;

  @ApiProperty()
  @Column({ nullable: true })
  website: string;
}
