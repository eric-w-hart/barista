import { Component, OnInit, Input } from '@angular/core';
import { Threshold } from '@app/shared/interfaces/Threshold';

@Component({
  selector: 'app-chart-gauge',
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
                      <h3>Index Thresholds</h3>
                      Low: < {{ threshold.low }}<br>
                      Medium: < {{ threshold.medium }}<br>
                      High: < {{ threshold.high }}<br>
                      Critical: > {{ threshold.high }} <br>
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
          <div *ngIf="(!dataset || dataset.length < 1) && !isLoading">
            <h2> No data. </h2>
          </div>
          <app-gauge-chart *ngIf="dataset && !isLoading" 
            [data]="dataset"
            [angleSpan]="240"
            [startAngle]="-120"
            [max]="this.threshold.high"
            >
          </app-gauge-chart>
        </mat-card-content>
      </mat-card>
  `,
  styles: ['chart-gauge.component.scss',],
})
export class ChartGaugeComponent implements OnInit {
  // Member Variables:
  @Input() isLoggedIn: boolean;
  @Input() threshold: Threshold;
  @Input() dataset: any;
  @Input() title: string;
  @Input() isLoading: boolean;
  @Input() help: string;
  
  constructor() { }

  ngOnInit(): void {
  }

}

