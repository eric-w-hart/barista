import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { LicenseScanResultItem } from './LicenseScanResultItem';
import { ModelBase } from './ModelBase';
import { Obligation } from './Obligation';

@Entity()
export class License extends ModelBase {
  @ApiProperty()
  @Column({ unique: true })
  code: string;

  @ApiProperty()
  @Column({ nullable: true })
  desc: string;

  @ApiProperty()
  @Column({ name: 'homepage_url', nullable: true })
  homepageUrl: string;

  @ApiProperty()
  @Column({ name: 'is_cpdx', nullable: false, default: false })
  isCpdx: boolean;

  @ApiProperty({ type: type => LicenseScanResultItem, isArray: true })
  @OneToMany(type => LicenseScanResultItem, licenseScanResultItem => licenseScanResultItem.license, { nullable: true })
  @JoinTable()
  licenseScanResultItems: LicenseScanResultItem[];

  // TODO: Add Unique Constraint: @Column({ unique: true })
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ type: type => Obligation, isArray: true })
  @ManyToMany(type => Obligation, obligation => obligation.licenses, {
    nullable: true,
  })
  @JoinTable({
    name: 'license_obligations_obligation',
    joinColumn: {
      name: 'licenseCode',
      referencedColumnName: 'code',
    },
    inverseJoinColumn: {
      name: 'obligationCode',
      referencedColumnName: 'code',
    },
  })
  obligations: Obligation[];

  @ApiProperty()
  @Column({ name: 'reference_url', nullable: true })
  referenceUrl: string;

  @ApiProperty()
  @Column({ name: 'text_url', nullable: true })
  textUrl: string;

  /**
   * A boolean to indicate if this is a new license found by the system
   * that has not yet been reviewed by a human.
   */
  @ApiProperty()
  @Column({ name: 'unknown_license', nullable: false, default: false })
  unknownLicense: boolean;
}
