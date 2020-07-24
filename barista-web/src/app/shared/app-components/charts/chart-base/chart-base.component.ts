import { Input, OnInit, Directive } from '@angular/core';

@Directive()
export abstract class ChartBaseComponent implements OnInit {
  protected constructor() {}
  @Input() data: any[];
  @Input() legend: boolean;
  @Input() legendTitle: string;
  @Input() colorScheme: any = { 
    domain: [
      "#682729","#aa5a35","#eb8c40","#ffbf66","#a1b579","#43aa8b","#08c5d1","#5fa4af","#b5838d"
    ]};


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
