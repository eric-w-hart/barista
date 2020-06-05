import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BomItemBase } from './BomItemBase';
import { License } from './License';
import { Project } from './Project';
import { ProjectScanStatusType } from './ProjectScanStatusType';

@Entity()
export class BomLicenseException extends BomItemBase {
  /**
   * A convenience association to the license since there is no relationship with a LicenseScanResultItem
   */
  @ApiProperty()
  @OneToOne((type) => License, {
    eager: true,
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn()
  license: License;

  /**
   * Corresponds to the path field on the LicenseScanResultItem
   */
  @Column()
  @ApiProperty()
  licenseItemPath: string;

  @ApiProperty({ type: (type) => Project })
  @ManyToOne((type) => Project, (project) => project.licenseExceptions, {
    eager: true,
    onDelete: 'CASCADE',
  })
  project: Project;

  /**
   * The ProjectScanStatus
   */
  @ApiProperty({ type: (type) => ProjectScanStatusType })
  @ManyToOne((type) => ProjectScanStatusType, { eager: true })
  @JoinColumn({
    name: 'project_scan_status_type_code',
    referencedColumnName: 'code',
  })
  projectScanStatus: ProjectScanStatusType;
}
