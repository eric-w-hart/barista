import { ProjectDistinctLicenseAttributionDto } from './../../../../../shared/api/model/project-distinct-license-attribution-dto';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScanApiService } from '@app/shared/api';

@Component({
  selector: 'app-license-attribution-result',
  templateUrl: './license-attribution-result.component.html',
  styleUrls: ['./license-attribution-result.component.scss'],
})
export class LicenseAttributionResultComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute, private scanApiService: ScanApiService) {}
  attribution = '';
  isLoadingAttribution = true;

  ngOnInit() {
    const scanId = this.route.snapshot.paramMap.get('scanId');
    this.scanApiService.scanIdAttributionGet(Number(scanId)).subscribe((response) => {
      response.forEach((element) => {
        this.attribution += 'Package: ';
        this.attribution += element.packageName + '\n\n';
        this.attribution += 'License: ';
        this.attribution += element.clearDefined?.license ? element.clearDefined.license : element.license;
        this.attribution += '\n\n';
        this.attribution += 'Copyrights: \n';
        this.attribution += element.clearDefined?.copyrights ? element.clearDefined.copyrights : '';
        this.attribution += '\n\n';
        this.attribution += 'License Text: \n';
        this.attribution += element.clearDefined?.licensetext ? element.clearDefined.licensetext : element.licenselink;
        this.attribution += '\n\n';
      });
      this.isLoadingAttribution = false;
    });
  }
}
