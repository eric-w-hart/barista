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

  // create a variable for each dataset we want stored on the page.
  // for consistency, variables end in Data, async variables end in Data$
  isLoggedIn: boolean;
  topComponentLicenseData: any;
  topComponentScansData: any;
  projectsAddedMonthly: any;
  monthlyProjectScans: any;
  highVulnerability: any;
  licenseOnCompliance: any;
  tempData: any;
  // TODO: create DTO for each dataset, wrap it in observable

  /**
   * All initialization of the datasets & graphs occurs here.
   * Handles subscribing of data async's into data vars.
   */
  ngOnInit(): void {

    this.isLoggedIn = AuthService.isLoggedIn;

    this.statsApi.statsComponentsGet('organization').subscribe((response) => {
      this.topComponentLicenseData = response;
    })

    this.statsApi.statsComponentsScansGet('organization').subscribe((response) => {
      this.topComponentScansData = response;
    })

    this.statsApi.statsProjectsGet().subscribe((response) => {
      this.projectsAddedMonthly = response;
    })
    
    this.statsApi.statsProjectsScansGet().subscribe((response) => {
      this.monthlyProjectScans = response;
    })

    this.statsApi.statsHighVulnerabilityGet('organization').subscribe((response) => {
      this.highVulnerability = [{"name": "High Vulnerability Index", "value": response}];
    })

    this.statsApi.statsLicenseOnComplianceGet('organization').subscribe((response) => {
      this.licenseOnCompliance = [{"name": "License Compliance Index", "value": response}];
    })
  }
}