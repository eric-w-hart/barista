import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { ModelBase } from './ModelBase';

@Entity()
export class ToolTip extends ModelBase {
  @ApiProperty()
  @Column({ type: 'text', nullable: false })
  content: string;

  @ApiProperty()
  @Column({ name: 'element_name', type: 'text', nullable: false })
  elementName: string;

  @ApiProperty()
  @Column({ type: 'boolean', nullable: false, default: true })
  enabled: boolean;

  @ApiProperty()
  @Column({ name: 'page_name', type: 'text', nullable: false })
  pageName: string;
}
