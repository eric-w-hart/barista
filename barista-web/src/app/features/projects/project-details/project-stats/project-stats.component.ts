import { Component, Input, OnInit } from '@angular/core';
import {
  ProjectDistinctLicenseDto,
  ProjectDistinctSeverityDto,
  ProjectDistinctVulnerabilityDto,
} from '@app/shared/api';
import { ChartElementDto } from '@app/shared/api/model/chart-element-dto';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'app-project-stats',
  templateUrl: './project-stats.component.html',
  styleUrls: ['./project-stats.component.scss'],
})
export class ProjectStatsComponent implements OnInit {
  constructor() {}

  licenseData;
  isLoadingLicenseData: boolean;
  @Input() licenseData$: Observable<ProjectDistinctLicenseDto>;

  severityData;
  isLoadingSeverityData: boolean;
  @Input() severityData$: Observable<ProjectDistinctSeverityDto>;

  vulnerabilityData;
  isLoadingVulnerabilityData: boolean;
  @Input() vulnerabilityData$: Observable<ProjectDistinctVulnerabilityDto>;

  ngOnInit() {
    this.isLoadingLicenseData = true;
    this.isLoadingSeverityData = true;
    this.isLoadingVulnerabilityData = true;
    if (this.licenseData$) {
      this.licenseData$
        .pipe(
          first(),
          map(items => {
            const data: ChartElementDto[] = _.map(items, (item: any) => {
              return {'name': item.license.name, 'value': Number(item.count)};
            });
            data.sort((x, y) => {
              // inverted so that higher numbers are first
              return -(x.value - y.value);
            });
            return data;
          }),
        )
        .subscribe(data => {
          this.licenseData = data;
          this.isLoadingLicenseData = false;
        });
    }

    if (this.vulnerabilityData$) {
      this.vulnerabilityData$
        .pipe(
          first(),
          map(items => {
            const data: ChartElementDto[] = _.map(items, (item: any) => {
              return {'name': item.path, 'value': Number(item.count)};
            });
            data.sort((x, y) => {
              // inverted so that higher numbers are first
              return -(x.value - y.value);
            });
            return data;
          }),
        )
        .subscribe(data => {
          this.vulnerabilityData = data;
          this.isLoadingVulnerabilityData = false;
        });
    }

    if (this.severityData$) {
      this.severityData$
        .pipe(
          first(),
          map(items => {
            const data: ChartElementDto[] = _.map(items, (item: any) => {
              return {'name': item.severity, 'value': Number(item.count)};
            });
            return data;
          }),
        )
        .subscribe(data => {
          this.severityData = data;
          this.isLoadingSeverityData = false;
        });
    }
  }
}
