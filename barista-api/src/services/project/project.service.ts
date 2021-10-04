import { Obligation, ProjectScanStatusType, Scan, SystemConfiguration } from '@app/models';
import { ProjectAttributionDto, ProjectDistinctLicenseDto, ProjectDistinctVulnerabilityDto } from '@app/models/DTOs';
import { ObligationSearchDto } from '@app/models/DTOs/ObligationSearchDto';
import { ProjectDistinctSeverityDto } from '@app/models/DTOs/ProjectDistinctSeverityDto';
import { Project } from '@app/models/Project';
import { AppServiceBase } from '@app/services/app-service-base/app-base.service';
import { BomManualLicenseService } from '@app/services/bom-manual-license/bom-manual-license.service';
import { ProjectAttributionService } from '@app/services/project-attribution/project-attribution.service';
import { ProjectScanStatusTypeService } from '@app/services/project-scan-status-type/project-scan-status-type.service';
import { ScanService } from '@app/services/scan/scan.service';
import { PaginateRawQuery } from '@app/shared/util/paginate-array-result';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequestOptions, GetManyDefaultResponse } from '@nestjsx/crud';
import { ParsedRequestParams } from '@nestjsx/crud-request';
import { logger } from 'elastic-apm-node';
import { SelectQueryBuilder } from 'typeorm';
import * as url from 'url';
import { debug } from 'winston';
import { git } from 'faker';

@Injectable()
export class ProjectService extends AppServiceBase<Project> {
  constructor(
    @Inject(forwardRef(() => ScanService))
    private readonly scanService: ScanService,
    @Inject(forwardRef(() => BomManualLicenseService))
    private readonly bomManualLicenseService: BomManualLicenseService,
    @Inject(forwardRef(() => ProjectAttributionService))
    private readonly projectAttributionService: ProjectAttributionService,
    @InjectRepository(Project) repo,
  ) {
    super(repo);
  }

  /**
   * Gets distinct licenses from the latest Scan of a Project
   */
  async distinctLicenses(project: Project): Promise<ProjectDistinctLicenseDto[]> {
    const query = `
            select l.name, count(*)
            from license l,
                 (
                     select lsri."licenseId" as licenseId
                     from license_scan_result_item lsri,
                          license_scan_result lsr,
                          scan s
                     where lsri."licenseScanId" = lsr.id
                       and lsr."scanId" = s.id
                       and s.id = (select s2.id
                                   from scan s2
                                   where s2."projectId" = $1
                                   order by s2.completed_at desc
                                   limit 1)
                       and lsr.id = (select lsr2.id
                                     from license_scan_result lsr2
                                     where lsr2."scanId" = (select s2.id
                                                            from scan s2
                                                            where s2."projectId" = $1
                                                            order by s2.completed_at desc
                                                            limit 1)
                                     order by s.completed_at desc
                                     limit 1)
                     union all
                     select bml."licenseId" as licenseId
                     from bom_manual_license bml
                     where bml."projectId" = $1) t
            where l.id = t.licenseId
            group by l.id`;
    const rows = await this.db.manager.query(query, [project.id]);
    return rows.map((row) => ({
      license: {
        name: row.name,
      },
      count: row.count,
    }));
  }

  /**
   * Gets distinct obligations from the latest Scan of a Project
   */
  async distinctObligations(project: Project): Promise<Obligation[]> {
    const scan = await this.latestCompletedScan(project);

    if (scan) {
      return this.scanService.distinctObligations(scan);
    } else {
      return [];
    }
  }

  /**
   * Gets distinct vulnerabilities from the latest Scan of a Project
   */
  async distinctSeverities(project: Project): Promise<ProjectDistinctSeverityDto[]> {
    const scan = await this.latestCompletedScan(project);

    if (scan) {
      return this.scanService.distinctSeverities(scan);
    } else {
      return [];
    }
  }

  async distinctUserIds(): Promise<any> {
    return this.db.createQueryBuilder('project').select('project.userId').addGroupBy('project.userId').getRawMany();
  }

  /**
   * Gets distinct vulnerabilities from the latest Scan of a Project
   */
  async distinctVulnerabilities(project: Project): Promise<ProjectDistinctVulnerabilityDto[]> {
    const scan = await this.latestCompletedScan(project);

    if (scan) {
      return this.scanService.distinctVulnerabilities(scan);
    } else {
      return [];
    }
  }

  async getprojectAttribution(project: Project): Promise<ProjectAttributionDto> {
    const projectAttribution = new ProjectAttributionDto();
    const projectAttributionFound = await this.projectAttributionService.findOne({
      where: { project: project },
    });
    if (projectAttributionFound) {
      projectAttribution.licenseText = projectAttributionFound.attribution;
    } else {
      projectAttribution.licenseText = 'Successful scan required for attribution';
    }
    return projectAttribution;
  }

  getUsersProjectsQuery(userId: string): SelectQueryBuilder<Project> {
    return this.db.createQueryBuilder('project').where('project.userId IN (:...userId)', { userId });
  }

  async gitUrlAuthForProject(project: Project) {
    const log = new Logger('gitUrlAuthForProject');

    let gitUrl = project.gitUrl;

    log.log(`gitUrl: ${gitUrl}`);
    const gitServerURLS = JSON.parse(process.env['barista_git_servers']);

    if (gitServerURLS) {
      const gitServer = gitServerURLS.find((item) => {
        return url.parse(gitUrl).hostname.toLowerCase() == url.parse(item.url).hostname.toLowerCase();
      });

      const urlParts = url.parse(gitUrl);
      if (gitServer.username && gitServer.password) {
        urlParts.auth = `${gitServer.username}:${gitServer.password}`;

        gitUrl = url.format(urlParts);

        urlParts.auth = `${gitServer.username}:********`;

        log.log(`gitUrl: ${url.format(urlParts)}`);
      }
    }

    // if (gitUrl) {
    //   const urlParts = url.parse(gitUrl);

    //   const config = await SystemConfiguration.defaultConfiguration();

    //   let username = null;
    //   let password = null;

    //   // If it is a GutHub.com URL, add the Github credentials
    //   const isGitHubCom = urlParts.hostname.toLowerCase() === 'github.com';

    //   if (isGitHubCom) {
    //     log.log(`isGitHubCom: ${isGitHubCom}`);

    //     if (config.githubComUsernameEnvVar && config.githubComPasswordEnvVar) {
    //       if (process.env[config.githubComUsernameEnvVar]) {
    //         username = process.env[config.githubComUsernameEnvVar];
    //         log.log(`Setting username: process.env['${config.githubComUsernameEnvVar}']`);
    //       }

    //       if (process.env[config.githubComPasswordEnvVar]) {
    //         password = process.env[config.githubComPasswordEnvVar];
    //         log.log(`Setting password: process.env['${config.githubComPasswordEnvVar}']`);
    //       }
    //     }
    //   } else {
    //     // If it is a GutHub Enterprise URL, add GHE credentials
    //     let isGitHubEnterprise = false;

    //     if (process.env[config.githubEnterpriseUrlEnvVar]) {
    //       const gheUrl = process.env[config.githubEnterpriseUrlEnvVar];

    //       log.log(`gheUrl: ${gheUrl}`);

    //       if (gheUrl) {
    //         isGitHubEnterprise = urlParts.hostname.toLowerCase() === gheUrl.toLowerCase();

    //         if (isGitHubEnterprise) {
    //           log.log(`isGitHubEnterprise: ${isGitHubEnterprise}`);
    //         }
    //       }
    //     }

    //     if (isGitHubEnterprise) {
    //       if (config.githubEnterpriseUsernameEnvVar && config.githubEnterprisePasswordEnvVar) {
    //         username = process.env[config.githubEnterpriseUsernameEnvVar];
    //         password = process.env[config.githubEnterprisePasswordEnvVar];

    //         log.log(`Setting username: process.env['${config.githubEnterpriseUsernameEnvVar}']`);
    //         log.log(`Setting password: process.env['${config.githubEnterprisePasswordEnvVar}']`);

    //         if (process.env[config.githubEnterpriseUsernameEnvVar]) {
    //           username = process.env[config.githubEnterpriseUsernameEnvVar];
    //           log.log(`Setting username: process.env['${config.githubEnterpriseUsernameEnvVar}']`);
    //         }

    //         if (process.env[config.githubEnterprisePasswordEnvVar]) {
    //           password = process.env[config.githubEnterprisePasswordEnvVar];
    //           log.log(`Setting password: process.env['${config.githubEnterprisePasswordEnvVar}']`);
    //         }
    //       }
    //     }
    //   }

    //   if (username && password) {
    //     urlParts.auth = `${username}:${password}`;

    //     gitUrl = url.format(urlParts);

    //     urlParts.auth = `${username}:********`;

    //     log.log(`gitUrl: ${url.format(urlParts)}`);
    //   }
    // }

    return gitUrl;
  }

  async highestLicenseStatus(project: Project): Promise<ProjectScanStatusType> {
    const scan = await this.latestCompletedScan(project);

    if (scan) {
      const licenseScan = await this.scanService.latestCompletedLicenseScan(scan);

      return this.scanService.highestLicenseStatus(licenseScan, project);
    } else {
      if (project.globalLicenseException) {
        return ProjectScanStatusTypeService.Green();
      } else if ((await this.bomManualLicenseService.manualLicenseCount(project)) > 0) {
        // Must account for the condition when there exists a manual license, but no scans
        return this.scanService.highestLicenseStatus(null, project);
      } else {
        return ProjectScanStatusTypeService.Unknown();
      }
    }
  }

  async highestSecurityStatus(project: Project): Promise<ProjectScanStatusType> {
    const scan = await this.latestCompletedScan(project);

    if (scan) {
      return this.scanService.highestSecurityStatus(scan, project);
    } else {
      if (project.globalSecurityException) {
        return ProjectScanStatusTypeService.Green();
      } else {
        return ProjectScanStatusTypeService.Unknown();
      }
    }
  }

  /**
   * Gets the latest completed Scan of a Project
   */
  async latestCompletedScan(project: Project): Promise<Scan> {
    return await Scan.createQueryBuilder('scan')
      .leftJoin('scan.project', 'project')
      .where('project.id = :id and scan.completed_at is not null', {
        id: project.id,
      })
      .orderBy('scan.completed_at', 'DESC')
      .limit(1)
      .getOne();
  }

  async rawQuery<T = any[]>(query: string, parameters: object = {}): Promise<T> {
    const conn = this.db.manager.connection;
    const [escapedQuery, escapedParams] = conn.driver.escapeQueryWithParameters(query, parameters, {});
    return conn.query(escapedQuery, escapedParams);
  }

  async getProjectsMany(
    parsed: ParsedRequestParams,
    options: CrudRequestOptions,
    userId: string[],
  ): Promise<Project[]> {
    let builder = await this.createBuilder(parsed, options);

    if (userId && parsed.filter.length) {
      builder = builder.andWhere('Project.userId IN (:...userId)', { userId });
    } else if (userId) {
      builder = builder.where('Project.userId IN (:...userId)', { userId });
    }

    const log = new Logger('getProjectsMany');

    const projects = await builder.getMany();

    if (
      !projects.length ||
      (parsed.fields.length &&
        !parsed.fields.includes('latestSecurityStatus') &&
        !parsed.fields.includes('latestLicenseStatus'))
    ) {
      return projects;
    }
    const projectArray = projects.map((project) => project.id);
    const query = ` select
                      p.id,
                      max(psst.sort_order) as maxSecurity,
                      case
                        when max(psst.sort_order) = 3 then 'Red'
                        when max(psst.sort_order) = 2 then 'Yellow'
                        when max(psst.sort_order) = 1 then 'Green'
                        else 'Green'
                      end as latestSecurityStatus,
                      null as latestLicenseStatus
                    from
                      project p
                    left join scan s2 on
                      p.id = s2."projectId"
                      and s2.id = (
                      select
                        Max(s3.id)
                      from
                        scan s3
                      where
                        s3."projectId" = p.id
                        and s3.completed_at is not null)
                    left join security_scan_result ssr on
                      ssr."scanId" = s2.id
                    left join security_scan_result_item ssri on
                      ssr.id = ssri."securityScanId"
                      and not exists (
                      select
                        id
                      from
                        bom_security_exception bse
                      where
                        s2."projectId" = bse."projectId"
                        and ssri."path" = bse."securityItemPath")
                    left join project_scan_status_type psst on
                      ssri.project_scan_status_type_code = psst.code
                    where
                      s2.completed_at is not null
                      and p.id in (:...projectIds)
                    group by
                      p.id
                    union
                    select
                      p.id,
                      max(psst.sort_order) as maxSecurity,
                      null as latestSecurityStatus,
                      case
                        when max(psst.sort_order) = 3 then 'Red'
                        when max(psst.sort_order) = 2 then 'Yellow'
                        when max(psst.sort_order) = 1 then 'Green'
                        else 'Unknown'
                      end as latestLicenseStatus
                    from
                      project p
                    left join scan s2 on
                      p.id = s2."projectId"
                      and s2.id = (
                      select
                        Max(s3.id)
                      from
                        scan s3
                      where
                        s3."projectId" = p.id
                        and s3.completed_at is not null)
                    left join license_scan_result lsr on
                      lsr."scanId" = s2.id
                    left join license_scan_result_item lsri on
                      lsr.id = lsri."licenseScanId"
                      and not exists (
                      select
                        id
                      from
                        bom_license_exception ble
                      where
                        s2."projectId" = ble."projectId"
                        and lsri."displayIdentifier" = ble."licenseItemPath")
                    left join project_scan_status_type psst on
                      lsri.project_scan_status_type_code = psst.code
                    where
                      s2.completed_at is not null
                      and p.id in (:...projectIds)
                    group by
                      p.id`;

    const latestStatus = await this.rawQuery<any>(query, { projectIds: projectArray });

    const licenseExceptionQuery = ` select
                                      "projectId" as id,
                                      max(psst.sort_order) as maxSecurity,
                                      null as latestSecurityStatus,
                                      case
                                        when max(psst.sort_order) = 3 then 'Red'
                                        when max(psst.sort_order) = 2 then 'Yellow'
                                        when max(psst.sort_order) = 1 then 'Green'
                                        else 'Unknown'
                                      end as latestLicenseStatus
                                    from
                                      bom_license_exception ble
                                    left join project_scan_status_type psst on
                                      ble.project_scan_status_type_code = psst.code
                                    where
                                      "projectId" in (:...projectIds)
                                    group by
                                      "projectId"`;

    const licenseExceptions = await this.rawQuery<any>(licenseExceptionQuery, { projectIds: projectArray });

    const licenseManualQuery = `select
                                  bml."projectId" as id ,
                                  max(psst.sort_order) as maxSecurity,
                                  null as latestSecurityStatus,
                                  case
                                    when max(psst.sort_order) = 3 then 'Red'
                                    when max(psst.sort_order) = 2 then 'Yellow'
                                    when max(psst.sort_order) = 1 then 'Green'
                                    else 'Green'
                                  end as latestLicenseStatus
                                from
                                  bom_manual_license bml
                                left join project p2 on
                                  p2.id = bml."projectId"
                                left join license l2 on
                                  bml."licenseId" = l2.id
                                left join license_status_deployment_type lsdt on
                                  lsdt.license_code = l2.code
                                  and lsdt.deployment_type_code = p2.deployment_type_code
                                left join project_scan_status_type psst on
                                  lsdt.project_scan_status_type_code = psst.code
                                where
                                  bml."projectId" in (:...projectIds)
                                group by
                                  "projectId"`;

    const licenseManual = await this.rawQuery<any>(licenseManualQuery, { projectIds: projectArray });

    projects.map(function (project) {
      var latest = latestStatus.find((stat) => stat.id === project.id && !stat.latestlicensestatus);
      if (!parsed.fields.length || parsed.fields.includes('latestSecurityStatus')) {
        if (latest?.latestsecuritystatus) {
          project.latestSecurityStatus = latest.latestsecuritystatus;
        } else {
          if (project.globalSecurityException) {
            project.latestSecurityStatus = 'Green';
          } else {
            project.latestSecurityStatus = 'Unknown';
          }
        }
      }

      var latest = latestStatus.find((stat) => stat.id === project.id && !stat.latestsecuritystatus);
      if (!parsed.fields.length || parsed.fields.includes('latestLicenseStatus')) {
        if (latest?.latestlicensestatus) {
          var latestexception = licenseExceptions.find((exception) => exception.id === project.id);
          if (latestexception) {
            project.latestLicenseStatus =
              latest.maxsecurity < latestexception.maxsecurity
                ? latestexception.latestlicensestatus
                : latest.latestlicensestatus;
          } else {
            project.latestLicenseStatus = latest.latestlicensestatus;
          }
          var latestmanual = licenseManual.find((manual) => manual.id === project.id);
          if (latestmanual) {
            project.latestLicenseStatus =
              latest.maxsecurity < latestmanual.maxsecurity
                ? latestmanual.latestlicensestatus
                : latest.latestlicensestatus;
          } else {
            project.latestLicenseStatus = latest.latestlicensestatus;
          }
        } else {
          if (project.globalLicenseException) {
            project.latestLicenseStatus = 'Green';
          } else {
            project.latestLicenseStatus = 'Unknown';
          }
        }
      }
    });
    return projects;
  }

  async uniqueBomObligations(
    projectId: number,
    page: number,
    pageSize: number,
  ): Promise<GetManyDefaultResponse<ObligationSearchDto>> {
    const query = `
            select *
            from obligation
            where code in (
                select loo."obligationCode"
                from license_obligations_obligation loo
                where loo."licenseCode" in (
                    select l.code
                    from scan s,
                         license_scan_result lsr,
                         license_scan_result_item lsri,
                         license l
                    where s."projectId" = $1
                      and lsr."scanId" = s.id
                      and lsr.id = lsri."licenseScanId"
                      and l.id = lsri."licenseId"
                    union
                    select l.code
                    from bom_manual_license bomml,
                         license l
                    where bomml."projectId" = $1
                      and l.id = bomml."licenseId"
                    group by l.code)
                group by loo."obligationCode")`;

    return await PaginateRawQuery(this.db.manager, query, [projectId], page, pageSize, (record) => ({
      id: record.id,
      code: record.code,
      name: record.name,
      desc: record.desc,
    }));
  }
}
