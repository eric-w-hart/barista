import { ApiProperty } from '@nestjs/swagger';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DeploymentType } from './DeploymentType';
import { License } from './License';
import { ModelBase } from './ModelBase';
import { ProjectScanStatusType } from './ProjectScanStatusType';

@Entity()
export class LicenseStatusDeploymentType extends ModelBase {
  /**
   * The DeploymentType
   */
  @ApiProperty({ type: (type) => DeploymentType })
  @ManyToOne((type) => DeploymentType, { eager: true })
  @JoinColumn({ name: 'deployment_type_code', referencedColumnName: 'code' })
  deploymentType: DeploymentType;

  /**
   * The License
   */
  @ApiProperty({ type: (type) => License })
  @ManyToOne((type) => License, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'license_code', referencedColumnName: 'code' })
  license: License;

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
