import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UserApiService } from '@app/shared/api/api/user-api.service';
import { UserInfo } from '@app/shared/api/model/user-info';

@Component({
  selector: 'app-banner',
  template: `
    <div *ngIf="!isLoggedIn">
      <div class="image">
        <img src="assets/images/barista_logo_text_removed.png">
      </div>
      <div class="mat-headline banner-text" style="text-align: center;">
        Open Source Governance <br> Ensuring You Always Have a Great Brew
      </div>
      <div class="button">
        <a mat-raised-button [href]="'https://optum.github.io/barista/'" target="_blank">
          <span>
            Learn More
          </span>
        </a>
      </div>
    </div>
    <div class="button-toggle" *ngIf="isLoggedIn">
      <mat-button-toggle-group value="Organization">
        <div class="button">
          <mat-button-toggle (click)="changeDataset()" value="User" style="margin-right: 5px;"><span>User</span></mat-button-toggle>
        </div>
        <div class="button"> 
          <mat-button-toggle (click)="changeDataset('%')" value="Organization" style="margin-left: 5px;"><span>Organization</span></mat-button-toggle>
        </div>
      </mat-button-toggle-group>
    </div>
  `,
  styles: [],
})
export class BannerComponent implements OnInit {
  // Member Variables:
  @Input() isLoggedIn: boolean;
  dataset: string;
  @Output() changeDatasetEvent = new EventEmitter<string>();
  user: UserInfo;

  constructor(private userApi: UserApiService) { this.dataset = ''; }
  ngOnInit(): void { 
    if(this.isLoggedIn){
      // pass through userID
      this.userApi.userMeGet().subscribe((response) => {
      this.user = response;
    })
    }
  }

  sendDataset(dataset?: string){
    this.changeDatasetEvent.emit(this.dataset);
  }

  changeDataset(dataset?: string){
    if(dataset){
      // pass through generic selector
      this.dataset = dataset;
    } else {
      this.dataset = this.user.id;
    }

    this.sendDataset(this.dataset);
  }

}
