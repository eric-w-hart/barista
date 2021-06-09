import { ProjectAttribution } from '@app/models';
import { ProjectAttributionService } from '@app/services/project-attribution/project-attribution.service';
import { Body, Controller, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, CrudRequestInterceptor, ParsedRequest } from '@nestjsx/crud';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Crud({
  model: {
    type: ProjectAttribution,
  },
  query: {
    join: {
      project: {
        eager: true,
        exclude: ['createdAt', 'updatedAt'],
        persist: ['id'],
      },
    },
    sort: [
      {
        field: 'createdAt',
        order: 'DESC',
      },
    ],
  },
  routes: {
    exclude: ['createOneBase'],
  },
})
@ApiTags('ProjectNotes')
@Controller('project-notes')
export class ProjectAttributionController implements CrudController<ProjectAttribution> {
  constructor(public service: ProjectAttributionService) {}

  get base(): CrudController<ProjectAttribution> {
    return this;
  }

  @Post('/')
  @UseInterceptors(CrudRequestInterceptor)
  @ApiResponse({ status: 200, type: ProjectAttribution })
  createOneProjectNote(
    @Body() dto: ProjectAttribution,
    @ParsedRequest() req: CrudRequest,
    @Request() request: any,
  ): Promise<ProjectAttribution> {
    return this.service.createOne(req, dto);
  }
}
