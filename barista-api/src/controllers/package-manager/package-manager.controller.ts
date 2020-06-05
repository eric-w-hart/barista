import { PackageManager } from '@app/models/PackageManager';
import { PackageManagerService } from '@app/services/package-manager/package-manager.service';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';

@Crud({
  model: {
    type: PackageManager,
  },
})
@ApiTags('PackageManager')
@Controller('package-manager')
export class PackageManagerController implements CrudController<PackageManager> {
  constructor(public service: PackageManagerService) {}
}
