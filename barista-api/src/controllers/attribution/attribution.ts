import { ProjectDistinctLicenseAttributionDto } from '@app/models/DTOs';
import { ScanService } from '@app/services/scan/scan.service';
import { Body, Controller, Get, Param, Post, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { CrudRequestInterceptor } from '@nestjsx/crud';

// @UseGuards(AuthGuard('jwt'))
// @ApiOAuth2Auth()

@ApiUseTags('Attribution')
@Controller('attribution')
export class AttributionController {
  constructor(public service: ScanService, private commandBus: CommandBus) {}

  @Get('/byScanId/:id')
  @ApiResponse({ status: 200, type: [ProjectDistinctLicenseAttributionDto] })
  async getAttributions(@Param('id') id: number): Promise<ProjectDistinctLicenseAttributionDto[]> {
    if (id) {
      const scan = await this.service.findOne(id);
      if (scan) {
        return this.service.distinctLicenseAttributions(scan.id);
      }
    }
  }

  @Get('/byScanResultId/:id')
  @ApiResponse({ status: 200, type: [ProjectDistinctLicenseAttributionDto] })
  async getAttributionsbyScanResultItemId(@Param('id') id: number): Promise<ProjectDistinctLicenseAttributionDto> {
    if (id) {
      return this.service.licenseAttributionByModule(id);
    }
  }
}
