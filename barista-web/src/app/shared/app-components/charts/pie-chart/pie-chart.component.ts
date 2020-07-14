import { Component, OnInit } from '@angular/core';
import { ChartBaseComponent } from '@app/shared/app-components/charts/chart-base/chart-base.component';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['../chart-base/chart-base.component.scss',
              './pie-chart.component.scss'],
})
export class PieChartComponent extends ChartBaseComponent implements OnInit {
  constructor() {
    super();
  }

  // Options:
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'right';

  ngOnInit() {}

  ngAfterViewInit() {
    this.data = [...this.data];
  }
}
