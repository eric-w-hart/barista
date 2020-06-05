import { JobInfoDto } from '@app/models/DTOs/JobInfoDto';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { DeploymentType } from './DeploymentType';
import { LicenseScanResult } from './LicenseScanResult';
import { ModelBase } from './ModelBase';
import { Project } from './Project';
import { SecurityScanResult } from './SecurityScanResult';

@Entity()
export class Scan extends ModelBase {
  @ApiProperty({ type: Date })
  @Column({ name: 'completed_at', nullable: true })
  completedAt: Date;

  @ManyToOne((type) => DeploymentType, {
    eager: true,

    onDelete: 'SET NULL',
    nullable: true,
  })
  deploymentType: DeploymentType;

  @ApiProperty({ type: (type) => JobInfoDto })
  @Column({ name: 'job_info', type: 'jsonb', nullable: true })
  jobInfo: JobInfoDto;

  @ApiProperty({ type: (type) => LicenseScanResult, isArray: true })
  @OneToMany((type) => LicenseScanResult, (result) => result.scan, { eager: true })
  licenseScanResults: LicenseScanResult[];

  @ApiProperty({ type: (type) => Project })
  @ManyToOne((type) => Project, (project) => project.scans, {
    eager: true,
    onDelete: 'CASCADE',
  })
  project: Project;

  @ApiProperty({ type: (type) => SecurityScanResult, isArray: true })
  @OneToMany((type) => SecurityScanResult, (result) => result.scan)
  securityScanResults: SecurityScanResult[];

  @ApiProperty()
  @Column({ name: 'started_at', nullable: true })
  startedAt: Date;
}
