import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chart-bar-horizontal',
  template: `
  <mat-card>
  <mat-card-title>
    <div>
    {{ title }}
    <span style="float:right;">
        <a class="info">
          <mat-icon style="cursor:default" [inline]="true">help_outline</mat-icon>
          <span>
            <mat-card>
              <mat-card-content>
                {{ description }}
              </mat-card-content>
            </mat-card>
          </span>
        </a>
      </span>
    </div>
  </mat-card-title>
  <mat-card-content>
    <div *ngIf="!dataset || dataset.length < 1">
      <h2> No data. </h2>
    </div>
    <app-horizontal-bar-chart *ngIf="dataset" 
      [data]="dataset" 
      [legend]="true"
      [legendTitle]="'Components:'" 
      [xAxisLabel]="'Count'">
    </app-horizontal-bar-chart>
  </mat-card-content>
</mat-card>
  `,
  styles: []
})
export class ChartBarHorizontalComponent implements OnInit {
  // Member Variables:
  @Input() dataset: any;
  @Input() title: string;
  @Input() description: string;
  constructor() { }

  ngOnInit(): void {
  }

}
