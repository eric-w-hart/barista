import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { ModelBase } from './ModelBase';

export class BomItemBase extends ModelBase {
  @ApiProperty()
  @Column({ type: 'text', default: '' })
  notes: string;

  @ApiProperty()
  @Column({ name: 'user_id' })
  userId: string;
}
