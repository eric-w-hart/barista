import { Component, OnInit, Input } from '@angular/core';
import { ChartBaseComponent } from '@app/shared/app-components/charts/chart-base/chart-base.component';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['../chart-base/chart-base.component.scss',
  './line-chart.component.scss']})
export class LineChartComponent extends ChartBaseComponent implements OnInit {
  constructor(){
    super();
  };
  // Options:
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  
  @Input() xAxisLabel;
  @Input() yAxisLabel;

  ngOnInit(){}

}
