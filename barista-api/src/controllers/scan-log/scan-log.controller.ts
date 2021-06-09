import { ScanLog } from '@app/models/ScanLog';
import { ScanLogService } from '@app/services/scan-log/scan-log.service';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';

@Crud({
  query: {
    join: {
      scan: {
        eager: true,
      },
    },
  },
  model: {
    type: ScanLog,
  },
})
@ApiTags('ScanLog')
@Controller('scan-log')
export class ScanLogController implements CrudController<ScanLog> {
  constructor(public service: ScanLogService) {}
}
