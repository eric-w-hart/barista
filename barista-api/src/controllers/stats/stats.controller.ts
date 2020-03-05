import { ProjectScanStateDto } from '@app/models/DTOs/ProjectScanStateDto';
import { Index } from 'typeorm';
import { Project, ProjectScanStatusType } from '@app/models';
import { LoginDto, UserInfo } from '@app/models/DTOs';
import { AuthJwtToken } from '@app/models/DTOs/AuthJwtToken';
import { ProjectService } from '@app/services/project/project.service';
import { ProjectScanStatusTypeService } from '@app/services/project-scan-status-type/project-scan-status-type.service';
import PaginateArrayResult from '@app/shared/util/paginate-array-result';
import { Body, Controller, Get, Param, Post, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOAuth2Auth, ApiResponse, ApiUseTags } from '@nestjs/swagger';

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
import { LogEntry } from '@nestjs/common/interfaces/external/kafka-options.interface';

@Crud({
  model: {
    type: Project,
  },
  query: {
    sort: [
      {
        field: 'createdAt',
        order: 'DESC',
      },
    ],
  },
  routes: {
    exclude: ['getOneBase', 'deleteOneBase', 'createManyBase', 'createOneBase', 'updateOneBase', 'replaceOneBase'],
  },
})
@ApiUseTags('stats')
@Controller('stats')
export class StatsController implements CrudController<Project> {
  constructor(public service: ProjectService, private projectScanStatusTypeService: ProjectScanStatusTypeService) {}
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
