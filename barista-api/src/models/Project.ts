import { ProjectAttribution } from './ProjectAttribution';
import { ProjectScanStatusType } from './ProjectScanStatusType';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BomLicenseException } from './BomLicenseException';
import { BomManualLicense } from './BomManualLicense';
import { BomSecurityException } from './BomSecurityException';
import { DeploymentType } from './DeploymentType';
import { ModelBase } from './ModelBase';
import { OutputFormatType } from './OutputFormatType';
import { PackageManager } from './PackageManager';
import { ProjectDevelopmentType } from './ProjectDevelopmentType';
import { ProjectNote } from './ProjectNote';
import { ProjectStatusType } from './ProjectStatusType';
import { Scan } from './Scan';

@Entity()
export class Project extends ModelBase {
  @ApiProperty()
  @Column({ type: 'text', default: '' })
  askID: string;

  @ApiProperty()
  @Column({ type: 'text', default: '' })
  configuration: string;

  @ApiProperty()
  @Column({ type: 'text', default: '', nullable: true })
  currentVersion: string;

  /**
   * A custom name for the package manager file, if any.
   */
  @ApiProperty()
  @Column({ name: 'custom_package_manager_filename', nullable: true })
  customPackageManagerFilename: string;

  /**
   * This is the location of the corresponding package specification relative to the project's root in source control.
   */
  @ApiProperty()
  @Column({ name: 'custom_package_manager_path', nullable: true })
  customPackageManagerPath: string;

  @ApiProperty({ type: type => DeploymentType })
  @JoinColumn({
    name: 'deployment_type_code',
    referencedColumnName: 'code',
  })
  @ManyToOne(type => DeploymentType, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  deploymentType: DeploymentType;

  @ApiProperty()
  @Column({ type: 'text', default: '' })
  description: string;

  @ApiProperty({ type: type => ProjectDevelopmentType })
  @JoinColumn({
    name: 'development_type_code',
    referencedColumnName: 'code',
  })
  @ManyToOne(type => ProjectDevelopmentType, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  developmentType: ProjectDevelopmentType;

  @ApiProperty()
  @Column({ name: 'git_url', nullable: true })
  gitUrl: string;

  @ApiProperty()
  @Column({ nullable: true, default: false })
  globalLicenseException: boolean;

  @ApiProperty()
  @Column({ nullable: true, default: false })
  globalSecurityException: boolean;

  @ApiProperty()
  @Column({ type: 'jsonb', nullable: true })
  importMetaData: any;

  @ApiProperty()
  latestLicenseStatus: string;

  @ApiProperty()
  latestSecurityStatus: string;

  @ApiProperty({ type: type => BomLicenseException, isArray: true })
  @OneToMany(type => BomLicenseException, item => item.project)
  licenseExceptions: BomLicenseException[];

  @ApiProperty({ type: type => BomManualLicense, isArray: true })
  @OneToMany(type => BomManualLicense, item => item.project)
  manualLicenses: BomManualLicense[];
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ type: 'text', default: '', nullable: true })
  outputEmail: string;

  @ApiProperty({ type: type => OutputFormatType })
  @JoinColumn({
    name: 'output_format_code',
    referencedColumnName: 'code',
  })
  @ManyToOne(type => OutputFormatType, {
    eager: true,

    onDelete: 'SET NULL',
    nullable: true,
  })
  outputFormat: OutputFormatType;

  @ApiProperty()
  @Column({ type: 'text', default: '', nullable: true })
  owner: string;

  @ApiProperty({ type: type => PackageManager })
  @JoinColumn({
    name: 'package_manager_code',
    referencedColumnName: 'code',
  })
  @ManyToOne(type => PackageManager, {
    eager: true,

    onDelete: 'SET NULL',
    nullable: true,
  })
  packageManager: PackageManager;

  @ApiProperty()
  @Column({ type: 'text', default: '', nullable: true })
  pathToUploadFileForScanning: string;

  @ApiProperty({ type: type => ProjectAttribution, isArray: true })
  @OneToMany(type => ProjectAttribution, projectAttribution => projectAttribution.project)
  projectAttributions: ProjectAttribution[];

  @ApiProperty({ type: type => ProjectNote, isArray: true })
  @OneToMany(type => ProjectNote, projectNote => projectNote.project)
  projectNotes: ProjectNote[];

  @ApiProperty({ type: type => ProjectStatusType })
  @JoinColumn({
    name: 'project_status_code',
    referencedColumnName: 'code',
  })
  @ManyToOne(type => ProjectStatusType, {
    eager: true,

    onDelete: 'SET NULL',
    nullable: true,
  })
  projectStatus: ProjectStatusType;

  @ApiProperty({ type: type => Scan, isArray: true })
  @OneToMany(type => Scan, scan => scan.project)
  scans: Scan[];

  @ApiProperty({ type: type => BomSecurityException, isArray: true })
  @OneToMany(type => BomSecurityException, item => item.project)
  securityExceptions: BomSecurityException[];

  @ApiProperty()
  @Column({ type: 'text', default: '', nullable: false, width: 64 })
  @Index('project_user_idx1')
  userId: string;

  @ApiProperty()
  @Column({ nullable: true })
  wasImported: boolean;
}
