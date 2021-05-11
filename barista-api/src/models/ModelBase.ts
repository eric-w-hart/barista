import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class ModelBase extends BaseEntity {
  @ApiProperty()
  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'jsonb', nullable: true })
  metaData: any;

  @ApiProperty()
  @Column({ nullable: true })
  tag: string;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
