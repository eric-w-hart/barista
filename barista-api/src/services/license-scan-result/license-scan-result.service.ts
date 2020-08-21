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
    return (await LicenseScanResultItem.createQueryBuilder('ri')
      .innerJoin('ri.license', 'license')
      .innerJoin('ri.licenseScan', 'licenseScan')
      .addGroupBy('license.id')
      .addOrderBy('count(*)', 'DESC')
      .where('licenseScan.id = :id', { id: licenseScanResult.id })
      .select('license.name as name')
      .addSelect('count(*) as count')
      .getRawMany()).map(row => ({
      count: +row.count,
      license: {
        name: row.name,
      },
    }));
  }

  /**
   * Gets distinct licenses from a LicenseScanResult
   */
  async distinctLicensesAttribution(licenseScanId: Number): Promise<ProjectDistinctLicenseAttributionDto[]> {
    // const licenses = await LicenseScanResultItem.createQueryBuilder('ri')
    //   .innerJoin('ri.license', 'license')
    //   .innerJoin('ri.licenseScan', 'licenseScan')
    //   .where('licenseScan.id = :id', { id: licenseScanId })
    //   .select(
    //     'license.name as license, ri.publisherName as publisherName, ri.displayIdentifier, license.homepageUrl, license.referenceUrl',
    //   )
    //   .getRawMany();
    // const replaceval = /:/gi;
    // for (const license of licenses) {
    //   await this.clearlyDefinedService.postNotices(
    //     'maven/mavencentral/' + license.displayIdentifier.replace(replaceval, '/'),
    //   );
    //   this.logger.log('display = ' + license.displayIdentifier);
    // }
    return this.clearlyDefinedService.postDefinitions('"npm/npmjs/-/jquery/1.9.1"');
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
