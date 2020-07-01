import { Input, OnInit, Directive } from '@angular/core';

@Directive()
export abstract class ChartBaseComponent implements OnInit {
  protected constructor() {}
  @Input() data: any[];
  @Input() legend: boolean;
  @Input() legendTitle: string;

  ngOnInit() {}
}
