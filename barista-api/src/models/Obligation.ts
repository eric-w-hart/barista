import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { License } from './License';
import { ModelBase } from './ModelBase';

@Entity()
export class Obligation extends ModelBase {
  @ApiProperty()
  @Column({ unique: true })
  code: string;

  @ApiProperty()
  @Column()
  desc: string;

  @ApiProperty({ type: (type) => License, isArray: true })
  @ManyToMany((type) => License, (license) => license.obligations, {
    nullable: true,
  })
  @JoinTable({
    name: 'license_obligations_obligation',
    joinColumn: {
      name: 'obligationCode',
      referencedColumnName: 'code',
    },
    inverseJoinColumn: {
      name: 'licenseCode',
      referencedColumnName: 'code',
    },
  })
  licenses: License[];

  @ApiProperty()
  @Column()
  name: string;
}
