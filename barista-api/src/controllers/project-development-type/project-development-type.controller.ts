import { ProjectDevelopmentType } from '@app/models/ProjectDevelopmentType';
import { ProjectDevelopmentTypeService } from '@app/services/project-development-type/project-development-type.service';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';

@Crud({
  model: {
    type: ProjectDevelopmentType,
  },
})
@ApiTags('ProjectDevelopmentType')
@Controller('project-development-type')
export class ProjectDevelopmentTypeController implements CrudController<ProjectDevelopmentType> {
  constructor(public service: ProjectDevelopmentTypeService) {}
}
