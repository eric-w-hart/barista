import { Component, OnInit } from '@angular/core';

import { AuthService, AuthServiceStatus } from '@app/features/auth/auth.service';
import { StatsApiService } from '@app/shared/api/api/stats-api.service';
import { observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private statsApi: StatsApiService) {}

  /* Data Variables */
  isLoggedIn: boolean;
  topComponentLicenseData: any;
  topComponentScansData: any;
  projectsAddedMonthly: any;
  monthlyProjectScans: any;
  highVulnerability: any;
  licenseOnCompliance: any;

  /**
   * All initialization of the datasets & graphs occurs here.
   * Handles subscribing of data async's into data vars.
   */
  ngOnInit(): void {
    this.isLoggedIn = AuthService.isLoggedIn;

    this.statsApi.statsComponentsGet().subscribe((response) => {
      this.topComponentLicenseData = response;
    });
    console.log(this.topComponentLicenseData);
    this.statsApi.statsComponentsScansGet().subscribe((response) => {
      this.topComponentScansData = response;
    })
    console.log(this.topComponentScansData);
    this.statsApi.statsProjectsGet().subscribe((response) => {
      response = this.parseMonth(response);
      this.projectsAddedMonthly = response;
    })
    console.log(this.projectsAddedMonthly);
    this.statsApi.statsProjectsScansGet().subscribe((response) => {
      response = this.parseMonth(response);
      this.monthlyProjectScans = response;
    })
    console.log(this.monthlyProjectScans);
    this.statsApi.statsHighVulnerabilityGet().subscribe((response) => {
      var displayName = this.displaySeverity(0.25, 0.5, 0.75, response);
      this.highVulnerability = [{"name": displayName, "value": response}];
    })
    console.log(this.highVulnerability);
    this.statsApi.statsLicenseOnComplianceGet().subscribe((response) => {
      var displayName = this.displaySeverity(0.25, 0.5, 0.75, response);
      this.licenseOnCompliance = [{"name": displayName, "value": response}];
    })
    console.log(this.licenseOnCompliance);
    }

    displaySeverity(low: number, med: number, high: number, n: any){
      if(n < low){ return 'LOW' }
      else if(n < med){ return 'MEDIUM' }
      else if(n < high){ return 'HIGH' }
      else { return 'CRITICAL' }
    }

    parseMonth(data: any){
      for (var item of data){
        switch (item.name.substring(5, 7)) {
          case "01": {
            item.name = "January";
            break;
          }
          case "02": {
            item.name = "February";
            break;
          }
          case "03": {
            item.name = "March";
            break;
          }
          case "04": {
            item.name = "April";
            break;
          }
          case "05": {
            item.name = "May";
            break;
          }
          case "06": {
            item.name = "June";
            break;
          }
          case "07": {
            item.name = "July";
            break;
          }
          case "08": {
            item.name = "August";
            break;
          }
          case "09": {
            item.name = "September";
            break;
          }
          case "10": {
            item.name = "October";
            break;
          }
          case "11": {
            item.name = "November";
            break;
          }
          case "12": {
            item.name = "December";
            break;
          }
          default: {
            item.name = "Unknown";
            break;
          }
        }
      }

      return data;
    }
}
