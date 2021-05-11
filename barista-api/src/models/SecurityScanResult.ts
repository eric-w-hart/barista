import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ModelBase } from './ModelBase';
import { Scan } from './Scan';
import { SecurityScanResultItem } from './SecurityScanResultItem';

@Entity()
export class SecurityScanResult extends ModelBase {
  @ApiProperty()
  @Column({ name: 'completed_at', nullable: true })
  completedAt: Date;

  @ApiProperty()
  @Column({ name: 'html_results', type: 'text', nullable: true })
  htmlResults: string;

  @ApiProperty()
  @Column({ name: 'json_results', type: 'jsonb', nullable: true })
  jsonResults: any;

  @ApiProperty({ type: type => Scan })
  @ManyToOne(type => Scan, scan => scan.securityScanResults, {
    onDelete: 'CASCADE',
  })
  scan: Scan;
  @ApiProperty()
  @Column({ name: 'scan_tool' })
  scanTool: string;

  @OneToMany(type => SecurityScanResultItem, resultItem => resultItem.securityScan)
  securityScanResultItems: SecurityScanResultItem[];

  @ApiProperty()
  @Column({ name: 'started_at', nullable: true })
  startedAt: Date;
}
