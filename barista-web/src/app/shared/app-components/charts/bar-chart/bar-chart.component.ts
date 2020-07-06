import { Component, OnInit, Input } from '@angular/core';
import { ChartBaseComponent } from '@app/shared/app-components/charts/chart-base/chart-base.component';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent extends ChartBaseComponent implements OnInit {
  constructor(){
    super();
  };
  // Options:
  view: any[] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  @Input() xAxisLabel;
  showYAxisLabel = true;
  @Input() yAxisLabel;

  colorScheme = {
    domain: ["#f25f5c","#ffe066","#247ba0","#70c1b3"]
  };

  ngOnInit(){}

}