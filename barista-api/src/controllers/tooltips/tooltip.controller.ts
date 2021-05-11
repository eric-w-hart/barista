import { ToolTip } from '@app/models';
import { ToolTipService } from '@app/services/tooltips/tooltips.service';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';

@Crud({
  model: {
    type: ToolTip,
  },
  routes: {
    exclude: ['deleteOneBase', 'createManyBase', 'createOneBase'],
  },
  query: {
    exclude: ['createdAt', 'updatedAt', 'tag', 'metaData'],
  },
})
@ApiTags('ToolTip')
@Controller('tooltip')
export class ToolTipController implements CrudController<ToolTip> {
  constructor(public service: ToolTipService) {}
}
