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
  @Input() max: any;
  @Input() angleSpan: any;
  @Input() startAngle:any;
  @Input() bigSegments:any;
  @Input() smallSegments:any;
  @Input() units;

  format(data) {
    // number needs 2 decimal places to avoid oversized number in gauge
    // checks if there are fewer than 2 decimal places
    if (data.toString().split(".").length === 1 || data.toString().split(".")[1].length < 2) {
      // returns the number with decimal places
      return data.toFixed(2) + '%';
    }
    // trunactes the number for 2 decimal places
    return (((data * 100) - (data * 100) % 1) / 100) + '%';
  }

  ngOnInit(){}

}
