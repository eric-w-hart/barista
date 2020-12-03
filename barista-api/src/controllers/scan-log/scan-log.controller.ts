import { ScanLog } from '@app/models/ScanLog';
import { ScanLogService } from '@app/services/scan-log/scan-log.service';
import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';

@Crud({
  model: {
    type: ScanLog,
  },
})
@ApiUseTags('ScanLog')
@Controller('scan-log')
export class ScanLogController implements CrudController<ScanLog> {
  constructor(public service: ScanLogService) {}
}
