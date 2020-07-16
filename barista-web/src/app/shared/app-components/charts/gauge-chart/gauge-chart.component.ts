import { Component, OnInit, Input } from '@angular/core';
import { ChartBaseComponent } from '@app/shared/app-components/charts/chart-base/chart-base.component';

@Component({
  selector: 'app-gauge-chart',
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['../chart-base/chart-base.component.scss',
              './gauge-chart.component.scss']
})
export class GaugeChartComponent extends ChartBaseComponent implements OnInit {

  constructor(){
    super();
  };

  //Options
  legendPosition: string = 'right';
  max: number;

  @Input() units;

  format(data) {
    //rounds the number
    return data.toFixed(2);
  }

  ngOnInit(){}

}
