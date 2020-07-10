import { Input, OnInit, Directive } from '@angular/core';

@Directive()
export abstract class ChartBaseComponent implements OnInit {
  protected constructor() {}
  @Input() data: any[];
  @Input() legend: boolean;
  @Input() legendTitle: string;

  gradient = false;
  colorScheme = {
    domain: ["#f25f5c","#ffe066","#247ba0","#70c1b3"]
   };

  ngOnInit() {}
}
