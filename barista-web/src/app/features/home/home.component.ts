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
      this.projectsAddedMonthly = response;
    })
    console.log(this.projectsAddedMonthly);
    this.statsApi.statsProjectsScansGet().subscribe((response) => {
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
}