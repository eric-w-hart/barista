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
  xAxisLabel: string = "hnnng";
  yAxisLabel: string = "arrrr";

  // Options:
  view: any[] = [700, 400];
  gradient: boolean = true;
  legendPosition: string = 'right';
  colorScheme = {
    domain: ["#50514f","#f25f5c","#ffe066","#247ba0","#70c1b3"]
  };
  xAxis: boolean = true; // show or hide the xAxis
  yAxis: boolean = true; 
  showGridLines: boolean = false;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  showDataLabel: boolean = true;
  noBarWhenZero: boolean = false;

  ngOnInit(){}

}