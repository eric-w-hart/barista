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
     value: "#B44346"
   },
   {
     name: "HIGH",
     value: "#DA8156"
   },
   {
     name: "MEDIUM",
     value: "#FFBF66"
   },
   {
     name: "MODERATE",
     value: "#08C5D1"
   },
   {
     name: "LOW",
     value: "#43AA8B" 
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
