import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class OptionValueModelBase extends BaseEntity {
  @ApiProperty()
  @Column({ nullable: false, unique: true, length: 64, primary: true })
  code: string;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;

  @ApiProperty()
  @Column({ type: 'text', default: '' })
  description: string;

  @ApiProperty()
  @Column({ nullable: false, name: 'is_default', default: false })
  isDefault: boolean;

  @ApiProperty()
  @Column({ type: 'jsonb', nullable: true })
  metaData: any;

  @ApiProperty()
  @Column({ nullable: true, name: 'sort_order', default: 0 })
  sortOrder: number;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
