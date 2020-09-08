import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AttributionService, LicenseScanResultItemApiService, ProjectApiService } from '@app/shared/api';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-license-attribution-result',
  templateUrl: './license-attribution-result.component.html',
  styleUrls: ['./license-attribution-result.component.scss'],
})
export class LicenseAttributionResultComponent implements OnInit {
  constructor(private route: ActivatedRoute, private projectApiService: ProjectApiService) {}
  attribution = '';
  isLoadingAttribution = true;

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('projectId');

    this.projectApiService.projectIdAttributionGet(projectId).subscribe((response) => {
      this.attribution = response.licenseText;
      this.isLoadingAttribution = false;
    });
  }
}
