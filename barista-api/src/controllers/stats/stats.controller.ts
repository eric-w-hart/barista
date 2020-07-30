import { LicenseScanResultItemService } from './../../services/license-scan-result-item/license-scan-result-item.service';
import { LicenseScanResultItem } from './../../models/LicenseScanResultItem';
import { Index } from 'typeorm';
import { Project, ProjectScanStatusType, VulnerabilityStatusDeploymentType } from '@app/models';
import { ProjectScanStatusTypeService } from '@app/services/project-scan-status-type/project-scan-status-type.service';
import { ProjectService } from '@app/services/project/project.service';
import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Res,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

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
    only: ['getManyBase'],
  },
})
@ApiUseTags('Stats')
@Controller('stats')
export class StatsController implements CrudController<Project> {
  constructor(public service: ProjectService, private licenseScanResultItemService: LicenseScanResultItemService) {}
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

  createFormat(label: string, value: string, status: string) {
    let color = status;
    if (status === 'unknown') {
      color = 'lightgrey';
      value = 'unknown';
    }

    const format = {
      text: [label, value],
      color: color,
      labelColor: '#855',
      template: 'flat',
    };

    return format;
  }

  createSVG(format: any) {
    const { BadgeFactory } = require('gh-badges');
    const bf = new BadgeFactory();

    return bf.create(format);
  }

  async getLatestScanDate(project: Project) {
    if (project) {
      const scan = await this.service.latestCompletedScan(project);
      if (scan) {
        return scan.createdAt.toDateString();
      }
    }
  }

  @Get('/badges/:id/licensestate')
  @Header('Content-Type', 'image/svg+xml')
  @Header('Content-Disposition', 'attachment; filename=licensestate.svg')
  async getLicenseState(@Param('id') id: string, @Res() res: Response) {
    const project = await this.service.db.findOne(Number(id));

    let licenseStatus = await ProjectScanStatusTypeService.Unknown();
    let latestScanDate = 'unknown';
    if (project) {
      const checklicenseStatus = await this.service.highestLicenseStatus(project);
      if (checklicenseStatus) {
        licenseStatus = checklicenseStatus;
      }
      latestScanDate = await this.getLatestScanDate(project);
    }

    const svg = this.createSVG(this.createFormat('barista license state', latestScanDate, licenseStatus.code));
    return res
      .status(200)
      .send(svg)
      .end();
  }

  @Get('/badges/:id/securitystate')
  @Header('Content-Type', 'image/svg+xml')
  @Header('Content-Disposition', 'attachment; filename=securitystate.svg')
  async getSecurityState(@Param('id') id: string, @Res() res: Response) {
    const project = await this.service.db.findOne(Number(id));

    let securityStatus = await ProjectScanStatusTypeService.Unknown();
    let latestScanDate = 'unknown';
    if (project) {
      const checksecurityStatus = await this.service.highestSecurityStatus(project);
      if (checksecurityStatus) {
        securityStatus = checksecurityStatus;
      }
      latestScanDate = await this.getLatestScanDate(project);
    }

    const svg = this.createSVG(this.createFormat('barista security state', latestScanDate, securityStatus.code));
    return res
      .status(200)
      .send(svg)
      .end();
  }

  @Get('/badges/:id/vulnerabilities')
  @Header('Content-Type', 'image/svg+xml')
  @Header('Content-Disposition', 'attachment; filename=vulnerabilities.svg')
  async getvulnerabilities(@Param('id') id: string, @Res() res: Response) {
    const project = await this.service.db.findOne(Number(id));

    let securityStatus = await ProjectScanStatusTypeService.Unknown();
    let valueString = '';
    if (project) {
      const vulnerabilities = await this.service.distinctSeverities(project);
      securityStatus = await this.service.highestSecurityStatus(project);
      if (vulnerabilities.length === 0) {
        valueString = 'none detected';
      }
      vulnerabilities.forEach(vul => (valueString = valueString + vul.severity + ':' + vul.count + ' '));
    }

    const svg = this.createSVG(this.createFormat('barista vulnerabilities', valueString, securityStatus.code));
    return res
      .status(200)
      .send(svg)
      .end();
  }

  @Get('/badges/:id/components')
  @Header('Content-Type', 'image/svg+xml')
  @Header('Content-Disposition', 'attachment; filename=components.svg')
  async getComponentsResults(@Param('id') id: string, @Res() res: Response) {
    const project = await this.service.db.findOne(Number(id));
    let valueString = 'unknown';
    let color = 'lightgrey';
    if (project) {
      const scan = await this.service.latestCompletedScan(project);
      if (scan) {
        const query = await this.licenseScanResultItemService.db
          .createQueryBuilder('resultItem')
          .leftJoin('resultItem.licenseScan', 'licenseScan')
          .leftJoinAndSelect('resultItem.projectScanStatus', 'projectScanStatus')
          .leftJoinAndSelect('resultItem.license', 'license')
          .leftJoin('licenseScan.scan', 'scan')
          .where('scan.id = :id', { id: scan.id })
          .getMany();

        valueString = query.length.toString();
        color = '#edb';
      }
    }

    const svg = this.createSVG(this.createFormat('barista open source components', valueString, color));
    return res
      .status(200)
      .send(svg)
      .end();
  }

  // What are the top 10 component licenses in use and how many components are using each license?
  @Get('/components/:userId')
  @ApiResponse({ status: 200 })
  async getTopComponents(@Param('userId') userId: string) {
    const query =
      `SELECT l2.name AS "name", COUNT(*) AS "value"
         FROM license l2, license_scan_result_item lsri, license_scan_result lsr,
           (SELECT DISTINCT ON (s2."projectId") s2.id, s2."projectId"
              FROM scan s2, project p2
             WHERE p2.id = s2."projectId" AND p2.development_type_code = 'organization' AND p2."userId" LIKE $1 ORDER BY s2."projectId", s2.completed_at DESC) scan
        WHERE scan.id = lsr."scanId" AND lsri."licenseScanId" = lsr.id AND l2.id = lsri."licenseId"
        GROUP BY 1 ORDER BY 2 DESC LIMIT 10`;
    const stats = await this.service.db.manager.query(query, [userId]);

    return stats;
  }

  // What are the top 10 components in use and how many times is each used across all projects scanned?
  @Get('/components/scans/:userId')
  @ApiResponse({ status: 200 })
  async getTopComponentScans(@Param('userId') userId: string) {
    const query =
      `SELECT lsri."displayIdentifier" AS name, COUNT(*) AS value
         FROM license l2, license_scan_result_item lsri, license_scan_result lsr, project p3,
           (SELECT DISTINCT ON (s2."projectId") s2.id, s2."projectId"
              FROM scan s2, project p2
             WHERE p2.id = s2."projectId" AND p2.development_type_code = 'organization' AND p2."userId" LIKE $1 ORDER BY s2."projectId", s2.completed_at DESC) scan
        WHERE scan.id = lsr."scanId" AND lsri."licenseScanId" = lsr.id AND l2.id = lsri."licenseId" AND scan."projectId" = p3.id
        GROUP BY 1 ORDER BY COUNT(*) DESC, 1 LIMIT 10`;
    const stats = await this.service.db.manager.query(query, [userId]);

    return stats;
  }


  // How many new projects are being added each month?
  @Get('/projects/:userId')
  @ApiResponse({ status: 200 })
  async getMonthlyProjects(@Param('userId') userId: string) {
    const query =
      `SELECT date_trunc('month', p2.created_at::date)::date AS name, COUNT(*) AS value
         FROM project p2
        WHERE p2.development_type_code = 'organization' AND p2."userId" LIKE $1
        GROUP BY 1 ORDER BY 1 LIMIT 12;`;
    const stats = await this.service.db.manager.query(query, [userId]);

    return stats;
  }

  // How many project scans are being done each month?
  @Get('/projects/scans/:userId')
  @ApiResponse({ status: 200 })
  async getMonthlyScans(@Param('userId') userId: string) {
    const query =
      `SELECT date_trunc('month', ssr.created_at::date)::date AS name, COUNT(*) AS value
         FROM security_scan_result ssr, project p2
        WHERE p2.development_type_code = 'organization' AND p2."userId" LIKE $1
        GROUP BY 1 ORDER BY 1 LIMIT 12;`;
    const stats = await this.service.db.manager.query(query, [userId]);

    return stats;
  }

  // What are the top 10 critical vulnerabilities discovered across all projects scanned?
  @Get('/vulnerabilities/:userId')
  @ApiResponse({ status: 200 })
  async getTopVulnerabilities(@Param('userId') userId: string) {
    const query =
          `SELECT DISTINCT ssri."path" AS "name", COUNT(*) AS value
             FROM project p2, security_scan_result_item ssri, security_scan_result ssr,
               (SELECT DISTINCT ON (s2."projectId" ) s2.id, s2."projectId"
                  FROM scan s2
                 ORDER BY s2."projectId", s2.completed_at DESC) scan
            WHERE ssr."scanId" = scan.id AND ssri."securityScanId" = ssr."scanId" AND scan."projectId" = p2.id AND p2.development_type_code = 'organization' AND p2."userId" LIKE $1 AND ssri."severity" IN ('CRITICAL','HIGH')
            GROUP BY ssri."path" ORDER BY COUNT(*) DESC LIMIT 10`;
    const stats = await this.service.db.manager.query(query, [userId]);

    return stats;
  }

  // What is our monthly license compliance index as defined by the formula:
  // total number of not approved licenses detected in scans (i.e. yellow or red status) divided by total number of approved licenses found in scans (i.e. green status)
  @Get('/licensenoncompliance/index/:userId')
  @ApiResponse({ status: 200 })
  async getLicenseComplianceIndex(@Param('userId') userId: string) {
    const query1 =
      `SELECT COUNT(*)
         FROM license l2, license_scan_result_item lsri, license_scan_result lsr,
           (SELECT DISTINCT ON (s2."projectId") s2.id, s2."projectId"
              FROM scan s2, project p2
             WHERE p2.id = s2."projectId" AND p2.development_type_code = 'organization' AND p2."userId" LIKE $1 ORDER BY s2."projectId", s2.completed_at DESC) scan
        WHERE scan.id = lsr."scanId" AND lsri."licenseScanId" = lsr.id AND l2.id = lsri."licenseId" AND lsri.project_scan_status_type_code <> 'green'`;
    const licenseProblemCount = await this.service.db.manager.query(query1, [userId]);
  
    const query2 =
      `SELECT COUNT(*)
         FROM license l2, license_scan_result_item lsri, license_scan_result lsr, project p3,
           (SELECT DISTINCT ON (s2."projectId") s2.id, s2."projectId"
              FROM scan s2, project p2
             WHERE p2.id = s2."projectId" AND p2.development_type_code = 'organization' AND p2."userId" LIKE $1 ORDER BY s2."projectId", s2.completed_at DESC) scan
        WHERE scan.id = lsr."scanId" AND lsri."licenseScanId" = lsr.id AND l2.id = lsri."licenseId" AND scan."projectId" = p3.id`;
    const licenseComponentCount = await this.service.db.manager.query(query2, [userId]);

    if (licenseProblemCount.length > 0 && licenseComponentCount.length > 0 && licenseComponentCount[0].count > 0) { 
      const licenseComplianceIndex = (licenseProblemCount[0].count / licenseComponentCount[0].count * 100); 

      return licenseComplianceIndex;
    } 

    return -1;  
  }

  // What is our monthly severe vulnerability index as defined by the formula: 
  // total number of critical or high vulnerabilities detected in scans divided by total number of packages found in scans
  @Get('/highvulnerability/index/:userId')
  @ApiResponse({ status: 200})
  async getHighVulnerabilityIndex(@Param('userId') userId: string) {
    const query1 =
      `SELECT COUNT(*)
         FROM project p2, security_scan_result_item ssri, security_scan_result ssr,
           (SELECT DISTINCT ON (s2."projectId") s2.id, s2."projectId"
              FROM scan s2 ORDER BY s2."projectId", s2.completed_at DESC) scan
        WHERE ssr."scanId" = scan.id AND ssri."securityScanId" = ssr."scanId" AND scan."projectId" = p2.id AND p2.development_type_code = 'organization' AND p2."userId" LIKE $1 AND ssri."severity" IN ('CRITICAL','HIGH')`; 
    const highVulnerabilityCount = await this.service.db.manager.query(query1, [userId]);

    const query2 =
      `SELECT COUNT(*)
         FROM license l2, license_scan_result_item lsri, license_scan_result lsr, project p3,
           (SELECT DISTINCT ON (s2."projectId") s2.id, s2."projectId"
              FROM scan s2, project p2
             WHERE p2.id = s2."projectId" AND p2.development_type_code = 'organization' AND p2."userId" LIKE $1 ORDER BY s2."projectId", s2.completed_at DESC) scan
        WHERE scan.id = lsr."scanId" AND lsri."licenseScanId" = lsr.id AND l2.id = lsri."licenseId" AND scan."projectId" = p3.id`; 
    const licenseComponentCount = await this.service.db.manager.query(query2, [userId]);

    if (highVulnerabilityCount.length > 0 && licenseComponentCount.length > 0 && licenseComponentCount[0].count > 0) {
      const highVulnerabilityIndex = highVulnerabilityCount[0].count / licenseComponentCount[0].count * 100; 

      return highVulnerabilityIndex; 
    } 

    return -1; 
  }
}