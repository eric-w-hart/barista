import { LicenseScanResult, LicenseScanResultItem, Obligation, Scan } from '@app/models';
import { ProjectDistinctLicenseDto } from '@app/models/DTOs';
import { ProjectDistinctLicenseAttributionDto } from '@app/models/DTOs';
import { AppServiceBase } from '@app/services/app-service-base/app-base.service';
import { ClearlyDefinedService } from '@app/services/clearly-defined/clearly-defined.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LicenseScanResultService extends AppServiceBase<LicenseScanResult> {
  constructor(@InjectRepository(LicenseScanResult) repo, private clearlyDefinedService: ClearlyDefinedService) {
    super(repo);
  }
  private logger = new Logger('LicenseScanResultService');

  /**
   * Gets distinct licenses from a LicenseScanResult
   */
  async distinctLicenses(licenseScanResult: LicenseScanResult): Promise<ProjectDistinctLicenseDto[]> {
    return (
      await LicenseScanResultItem.createQueryBuilder('ri')
        .innerJoin('ri.license', 'license')
        .innerJoin('ri.licenseScan', 'licenseScan')
        .addGroupBy('license.id')
        .addOrderBy('count(*)', 'DESC')
        .where('licenseScan.id = :id', { id: licenseScanResult.id })
        .select('license.name as name')
        .addSelect('count(*) as count')
        .getRawMany()
    ).map(row => ({
      count: +row.count,
      license: {
        name: row.name,
      },
    }));
  }

  /**
   * Gets distinct licenses from a LicenseScanResult
   */
  async licensesAttributionByScanId(scanId: number): Promise<ProjectDistinctLicenseAttributionDto[]> {
    const licenses = await LicenseScanResultItem.createQueryBuilder('ri')
      .innerJoin('license', 'license', 'ri."licenseId" = license.id')
      .innerJoin('license_scan_result', 'lsr', 'ri."licenseScanId" = lsr.id')
      .innerJoin('scan', 'scan', 'scan.id = lsr."scanId"')
      .innerJoin('project', 'p2', 'p2.id = scan."projectId"')
      .where('lsr."scanId" = :id', { id: scanId.toString() })
      .select('p2."package_manager_code",p2.id, ri.*, license.*')
      .getRawMany();
    const ret: ProjectDistinctLicenseAttributionDto[] = [];
    for (const license of licenses) {
      ret.push(await this.attributionByModule(license));
    }
    return ret;
  }

  async licensesAttributionByScanResultItem(
    licenseScanResultItemId: number,
  ): Promise<ProjectDistinctLicenseAttributionDto> {
    const license = await LicenseScanResultItem.createQueryBuilder('ri')
      .innerJoin('license', 'license', 'ri."licenseId" = license.id')
      .innerJoin('license_scan_result', 'lsr', 'ri."licenseScanId" = lsr.id')
      .innerJoin('scan', 'scan', 'scan.id = lsr."scanId"')
      .innerJoin('project', 'p2', 'p2.id = scan."projectId"')
      .where('ri.id = :id', { id: licenseScanResultItemId })
      .select('p2."package_manager_code",p2.id, ri.*, license.*')
      .select('p2."package_manager_code",p2.id, ri.*, license.*')
      .getRawOne();
    return await this.attributionByModule(license);
  }

  async attributionByModule(license) {
    if (license) {
      const packageConversion = await this.clearlyDefinedService.convertPackage(
        license.package_manager_code,
        license.displayIdentifier,
      );
      const projectDistinctLicenseAttributionDto = {} as ProjectDistinctLicenseAttributionDto;
      if (packageConversion) {
        const clearlyDefined = await this.clearlyDefinedService.postNotices(packageConversion);
        projectDistinctLicenseAttributionDto.clearDefined = clearlyDefined;
      }
      projectDistinctLicenseAttributionDto.packageName = license.displayIdentifier;
      projectDistinctLicenseAttributionDto.publisherName = license.publisherName;
      projectDistinctLicenseAttributionDto.publisherUrl = license.publisherUrl;
      projectDistinctLicenseAttributionDto.license = license.name;
      projectDistinctLicenseAttributionDto.licenselink = license.homepageUrl;
      this.logger.debug(JSON.stringify(license));
      this.logger.debug(JSON.stringify(projectDistinctLicenseAttributionDto));
      return projectDistinctLicenseAttributionDto;
    }
  }

  /**
   * Gets distinct obligations from a LicenseScanResult
   */
  async distinctObligations(licenseScanResult: LicenseScanResult): Promise<Obligation[]> {
    const obligationIdQuery = LicenseScanResultItem.createQueryBuilder('resultItem')
      .leftJoin('resultItem.licenseScan', 'licenseScan')
      .leftJoin('resultItem.license', 'license')
      .leftJoinAndSelect('license.obligations', 'obligations')
      .where('licenseScan.id = :id', { id: licenseScanResult.id })
      .select('DISTINCT obligations.id', 'obligationIds');

    return await Obligation.createQueryBuilder('obligation')
      .where('obligation.id IN (' + obligationIdQuery.getQuery() + ')')
      .setParameters(obligationIdQuery.getParameters())
      .getMany();
  }

  async insertResult(partial: Partial<LicenseScanResult>, scan: Scan) {
    const result = await this.db.create(partial);
    await result.save();
    result.scan = scan;
    await result.save();

    return result;
  }
}
