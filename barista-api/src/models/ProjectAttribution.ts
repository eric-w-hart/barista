import { ApiModelProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ModelBase } from './ModelBase';
import { Project } from './Project';

@Entity()
export class ProjectAttribution extends ModelBase {
  @ApiModelProperty()
  @Column({ type: 'text', default: '', nullable: false })
  attribution: string;

  @ApiModelProperty({ type: type => Project })
  @ManyToOne(type => Project, project => project.projectAttributions, {
    eager: true,
    onDelete: 'CASCADE',
  })
  project: Project;
}
