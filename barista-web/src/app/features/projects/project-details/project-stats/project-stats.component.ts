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
  @Input() licenseData$: Observable<ProjectDistinctLicenseDto>;

  severityData;
  @Input() severityData$: Observable<ProjectDistinctSeverityDto>;

  vulnerabilityData;
  @Input() vulnerabilityData$: Observable<ProjectDistinctVulnerabilityDto>;

  ngOnInit() {
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
        });
    }
  }
}
