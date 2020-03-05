import { Project } from '@app/models';
import { ProjectService } from '@app/services/project/project.service';
import { Body, Controller, Get, Param, Post, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

import {
  Crud,
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  GetManyDefaultResponse,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';

@Crud({
  model: {
    type: Project,
  },
  routes: {
    exclude: ['updateOneBase', 'getOneBase', 'deleteOneBase', 'createManyBase', 'createOneBase', 'replaceOneBase'],
  },
})
@ApiUseTags('Stats')
@Controller('stats')
export class StatsController implements CrudController<Project> {
  constructor(public service: ProjectService) {}
  get base(): CrudController<Project> {
    return this;
  }

  @Override()
  async getMany(@ParsedRequest() req: CrudRequest) {
    const answer = (await this.base.getManyBase(req)) as Project[];

    let i;
    for (i = 0; i < answer.length; i++) {
      const licenseStatus = await this.service.highestLicenseStatus(answer[i]);
      const securityStatus = await this.service.highestSecurityStatus(answer[i]);
      if (licenseStatus) {
        answer[i].LatestLicenseStatus = licenseStatus;
      }
      if (securityStatus) {
        answer[i].LatestSecurityStatus = securityStatus;
      }
    }
    return answer;
  }
}
