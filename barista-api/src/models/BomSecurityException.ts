import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BomItemBase } from './BomItemBase';
import { Project } from './Project';
import { ProjectScanStatusType } from './ProjectScanStatusType';

@Entity()
@Index(['cveId', 'project', 'securityItemPath'], { unique: true })
export class BomSecurityException extends BomItemBase {
  /**
   * The CVE ID for the vulnerability
   */
  @ApiProperty()
  @Column({ name: 'cve_id', nullable: true })
  cveId: string;

  @ApiProperty({ type: type => Project })
  @ManyToOne(type => Project, project => project.securityExceptions, {
    eager: true,
    onDelete: 'CASCADE',
  })
  project: Project;

  /**
   * The ProjectScanStatusType at the time of detection.
   */
  @ApiProperty({ type: type => ProjectScanStatusType })
  @ManyToOne(type => ProjectScanStatusType)
  @JoinColumn({ name: 'project_scan_status_type_code', referencedColumnName: 'code' })
  projectScanStatus: ProjectScanStatusType;

  /**
   * Corresponds to the path field on the SecurityScanResultItem
   */
  @ApiProperty()
  @Column()
  securityItemPath: string;
}
