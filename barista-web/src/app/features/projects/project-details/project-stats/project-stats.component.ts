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
import { concat } from 'lodash';
import { element } from 'protractor';

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

  severityArray: ChartElementDto[] = [ {'name': "LOW", 'value': 0},  {'name': "MODERATE", 'value': 0},  {'name': "MEDIUM", 'value': 0},  {'name': "HIGH", 'value': 0},  {'name': "CRITICAL", 'value': 0}];

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
            var data: ChartElementDto[] = _.map(items, (item: any) => {
              return {'name': item.severity + ": " + item.count, 'value': Number(item.count)};
            });
            let severityNames: string[] = this.severityArray.map( (item) => item.name.toLowerCase() );
            let dataNames: string[] = data.map((item) => item.name.toLowerCase());
            let resultArray: string[] = severityNames.filter(item => dataNames.indexOf(item) < 0);
            console.log(resultArray);
            let returnArray: ChartElementDto[] = resultArray.map((item) => {return {'name': item.toUpperCase(), 'value': 0}}
            );
            console.log(returnArray);
            console.log(data);
            return data.concat(returnArray);
          }),
        )
        .subscribe(data => {
          this.severityData = data;
        });
    }
  }
}
