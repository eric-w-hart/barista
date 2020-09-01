import { ProjectDistinctLicenseAttributionDto } from '@app/shared/api/model/project-distinct-license-attribution-dto';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AttributionService, LicenseScanResultItemApiService } from '@app/shared/api';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-license-attribution-result',
  templateUrl: './license-attribution-result.component.html',
  styleUrls: ['./license-attribution-result.component.scss'],
})
export class LicenseAttributionResultComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private attributionApiService: AttributionService,
    private licenseScanResultItemApiService: LicenseScanResultItemApiService,
  ) {}
  attribution = '';
  isLoadingAttribution = true;
  counter = 0;
  totalCount = 0;

  ngOnInit() {
    const scanId = this.route.snapshot.paramMap.get('scanId');
    const query: any = {};
    query.filter = 'licenseScan.scan||eq||' + scanId;
    this.licenseScanResultItemApiService
      .licenseScanResultItemGet(
        query.fields,
        query.filter,
        query.or,
        query.sort,
        query.join,
        query.perPage,
        query.offset,
        query.page,
        query.cache,
      )
      .subscribe((response) => {
        this.totalCount = response.length;
        console.log('total = ' + response.length);
        response.forEach((element) => {
          this.attributionApiService
            .attributionByScanResultIdIdGet(Number(element.id))
            .pipe(delay(50))
            .subscribe((attribution) => {
              this.attribution += 'Package: ';
              this.attribution += attribution.packageName + '\n\n';
              this.attribution += 'License: ';
              this.attribution += attribution.clearDefined?.license
                ? attribution.clearDefined.license
                : attribution.license;
              this.attribution += '\n\n';
              this.attribution += 'Copyrights: \n';
              this.attribution += attribution.clearDefined?.copyrights ? attribution.clearDefined.copyrights : '';
              this.attribution += '\n\n';
              this.attribution += 'License Text: \n';
              this.attribution += attribution.clearDefined?.licensetext
                ? attribution.clearDefined.licensetext
                : attribution.licenselink;
              this.attribution += '\n\n';
              this.counter++;
              console.log('counter = ' + this.counter);
              if (this.totalCount === this.counter) {
                this.isLoadingAttribution = false;
              }
            });
        });
      });
  }
}
