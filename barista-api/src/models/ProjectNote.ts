import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ModelBase } from './ModelBase';
import { Project } from './Project';

@Entity()
export class ProjectNote extends ModelBase {
  @ApiProperty()
  @Column({ type: 'text', default: '', nullable: false })
  note: string;

  @ApiProperty()
  @Column({ type: 'text', default: '', nullable: true })
  notePayload: string;

  @ApiProperty({ type: type => Project })
  @ManyToOne(type => Project, project => project.projectNotes, {
    eager: true,
    onDelete: 'CASCADE',
  })
  project: Project;

  @ApiProperty()
  @Column({ name: 'user_id', nullable: false })
  userId: string;
}
