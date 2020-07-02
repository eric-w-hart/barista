import { Component, OnInit } from '@angular/core';
import { ChartBaseComponent } from '@app/shared/app-components/charts/chart-base/chart-base.component';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent extends ChartBaseComponent implements OnInit {
  constructor() {
    super();
  }

  // Options:
  view: any[] = [700, 400];
  gradient: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'right';

  colorScheme = {
   domain: ["#50514f","#f25f5c","#ffe066","#247ba0","#70c1b3"]
  };

  ngOnInit() {}
}
