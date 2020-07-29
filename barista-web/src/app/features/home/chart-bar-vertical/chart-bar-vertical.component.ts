import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chart-bar-vertical',
  template: `
  <mat-card>
    <mat-card-title>
      <div>
        {{ title }}
      <span style="float:right;">
          <a class="info">
            <mat-icon [inline]="true">help_outline</mat-icon>
            <span>
              <mat-card>
                <mat-card-content>
                <h3> About:</h3>
                  {{ description }} <br>
                  <div *ngIf=isLoggedIn>
                    <h3> Help: </h3>
                    {{ help }}
                  </div>
                </mat-card-content>
              </mat-card>
            </span>
          </a>
        </span>
      </div>
    </mat-card-title>
    <mat-card-content>
      <div class="spinner" *ngIf="isLoading">
          <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
      </div>
      <div *ngIf="!dataset || dataset.length < 1">
        <h2> No data. </h2>
      </div>
      <app-bar-chart *ngIf="dataset && !isLoading" 
        [data]="dataset" 
        [legend]="true"
        [legendTitle]="'Months:'" 
        [xAxisLabel]="'Month'" 
        [yAxisLabel]="'Count'">
      </app-bar-chart>
    </mat-card-content>
  </mat-card>
  `,
  styles: []
})
export class ChartBarVerticalComponent implements OnInit {
  // Member Variables:
  @Input() isLoggedIn: boolean;
  @Input() dataset: any;
  @Input() title: string;
  @Input() description: string;
  @Input() isLoading: boolean;
  @Input() help: string;

  constructor() { }

  ngOnInit(): void {
  }

}
