import { Component, OnInit, Input } from '@angular/core';
import { ChartBaseComponent } from '@app/shared/app-components/charts/chart-base/chart-base.component';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['../chart-base/chart-base.component.scss',
              './bar-chart.component.scss']
})
export class BarChartComponent extends ChartBaseComponent implements OnInit {
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