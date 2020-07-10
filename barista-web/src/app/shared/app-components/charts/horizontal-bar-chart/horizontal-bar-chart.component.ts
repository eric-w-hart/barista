import { Component, OnInit, Input } from '@angular/core';
import { ChartBaseComponent } from '@app/shared/app-components/charts/chart-base/chart-base.component';

@Component({
  selector: 'app-horizontal-bar-chart',
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrls: ['../chart-base/chart-base.component.scss',
              './horizontal-bar-chart.component.scss']
})
export class HorizontalBarChartComponent extends ChartBaseComponent implements OnInit {

  constructor() { super(); };

  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;

  @Input() xAxisLabel;
  @Input() yAxisLabel;

  ngOnInit(): void {
  }

}
