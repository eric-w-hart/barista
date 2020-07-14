import { Input, OnInit, Directive } from '@angular/core';

@Directive()
export abstract class ChartBaseComponent implements OnInit {
  protected constructor() {}
  @Input() data: any[];
  @Input() legend: boolean;
  @Input() legendTitle: string;
  @Input() colorScheme: any = { domain: ["#DA8156","#43AA8B","#FFBF66","#08C5D1", "#B44346", "#2C5860"]};


  gradient = false;

  customColors = [
   {
     name: "CRITICAL",
     value: '#dd3333'
   },
   {
     name: "HIGH",
     value: '#ff8333'
   },
   {
     name: "MEDIUM",
     value: '#eeee33'
   },
   {
     name: "LOW",
     value: '#338833'
   },
   {
     name: "UNKNOWN",
     value: '#aaaaaa'
   }
 ];

  ngOnInit() {}

  ngAfterViewInit() {
    this.data = [...this.data];
  }
}
