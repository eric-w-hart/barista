import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { License } from './License';
import { LicenseScanResult } from './LicenseScanResult';
import { ProjectScanStatusType } from './ProjectScanStatusType';
import { ResultItemBase } from './ResultItemBase';

@Entity()
export class LicenseScanResultItem extends ResultItemBase {
  /**
   * A boolean to indicate if the license result was matched by "fuzzy" logic
   * in case it needs to be reviewed by a human.
   */
  @ApiProperty()
  @Column({ name: 'fuzzy_matched', nullable: false, default: false })
  fuzzyMatched: boolean;
  /**
   * The detected license
   */
  @ApiProperty({ type: (type) => License })
  @ManyToOne((type) => License, (license) => license)
  license: License;
  /**
   * The associated LicenseScanResult
   */
  @ApiProperty({ type: (type) => LicenseScanResult })
  @ManyToOne((type) => LicenseScanResult, (result) => result.licenseScanResultItems, { onDelete: 'CASCADE' })
  licenseScan: LicenseScanResult;

  /**
   * The ProjectScanStatusType at the time of detection.
   */
  @ApiProperty({ type: (type) => ProjectScanStatusType })
  @ManyToOne((type) => ProjectScanStatusType, { eager: true })
  @JoinColumn({ name: 'project_scan_status_type_code', referencedColumnName: 'code' })
  projectScanStatus: ProjectScanStatusType;

  @ApiProperty()
  @Column({ nullable: true })
  publisherEmail: string;

  @ApiProperty()
  @Column({ nullable: true })
  publisherName: string;

  @ApiProperty()
  @Column({ nullable: true })
  publisherUrl: string;
}
