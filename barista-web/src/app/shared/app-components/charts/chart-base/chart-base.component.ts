import { Input, OnInit, Directive } from '@angular/core';

@Directive()
export abstract class ChartBaseComponent implements OnInit {
  protected constructor() {}
  @Input() data: any[];
  @Input() legend: boolean;
  @Input() legendTitle: string;

  gradient = false;

  colorScheme = {
    domain: ["#DA8156","#43AA8B","#FFBF66","#08C5D1", "#B44346", "#2C5860"]
   };

  ngOnInit() {}

  ngAfterViewInit() {
    this.data = [...this.data];
  }
}
