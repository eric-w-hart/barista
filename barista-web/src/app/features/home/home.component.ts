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
  topComponentLicenseDataOrganization: any;
  topComponentLicenseDataCommunity: any;
  topComponentLicenseDataMy: any;
  topComponentScansDataOrganization: any;
  topComponentScansDataCommunity: any;
  topComponentScansDataMy: any;
  projectsAddedMonthly: any;
  monthlyProjectScans: any;
  highVulnerabilityOrganization: any;
  highVulnerabilityCommunity: any;
  highVulnerabilityMy: any;
  licenseOnComplianceOrganization: any;
  licenseOnComplianceCommunity: any;
  licenseOnComplianceMy: any;
  tempData: any;
  // TODO: create DTO for each dataset, wrap it in observable

  /**
   * All initialization of the datasets & graphs occurs here.
   * Handles subscribing of data async's into data vars.
   */
  ngOnInit(): void {

    this.isLoggedIn = AuthService.isLoggedIn;

    this.statsApi.statsComponentsGetOrganization().subscribe((response) => {
      this.topComponentLicenseDataOrganization = response;
    });
    console.log(this.topComponentLicenseDataOrganization);
    this.statsApi.statsComponentsGetCommunity().subscribe((response) => {
      this.topComponentLicenseDataCommunity = response;
    });
    console.log(this.topComponentLicenseDataCommunity);
    this.statsApi.statsComponentsGetMy().subscribe((response) => {
      this.topComponentLicenseDataMy = response;
    });
    console.log(this.topComponentLicenseDataMy);

    this.statsApi.statsComponentsScansGetOrganization().subscribe((response) => {
      this.topComponentScansDataOrganization = response;
    })
    console.log(this.topComponentScansDataOrganization);
    this.statsApi.statsComponentsScansGetCommunity().subscribe((response) => {
      this.topComponentScansDataCommunity = response;
    })
    console.log(this.topComponentScansDataCommunity);
    this.statsApi.statsComponentsScansGetMy().subscribe((response) => {
      this.topComponentScansDataMy = response;
    })
    console.log(this.topComponentScansDataMy);

    this.statsApi.statsProjectsGet().subscribe((response) => {
      this.projectsAddedMonthly = response;
    })
    console.log(this.projectsAddedMonthly);
    this.statsApi.statsProjectsScansGet().subscribe((response) => {
      this.monthlyProjectScans = response;
    })
    console.log(this.monthlyProjectScans);

    this.statsApi.statsHighVulnerabilityGetOrganization().subscribe((response) => {
      this.highVulnerabilityOrganization = [{"name": "High Vulnerability Index", "value": response}];
    })
    console.log(this.highVulnerabilityOrganization);
    this.statsApi.statsHighVulnerabilityGetCommunity().subscribe((response) => {
      this.highVulnerabilityCommunity = [{"name": "High Vulnerability Index", "value": response}];
    })
    console.log(this.highVulnerabilityCommunity);
    this.statsApi.statsHighVulnerabilityGetMy().subscribe((response) => {
      this.highVulnerabilityMy = [{"name": "High Vulnerability Index", "value": response}];
    })
    console.log(this.highVulnerabilityMy);

    this.statsApi.statsLicenseOnComplianceGetOrganization().subscribe((response) => {
      this.licenseOnComplianceOrganization = [{"name": "License Compliance Index", "value": response}];
    })
    console.log(this.licenseOnComplianceOrganization);
    this.statsApi.statsLicenseOnComplianceGetCommunity().subscribe((response) => {
      this.licenseOnComplianceCommunity = [{"name": "License Compliance Index", "value": response}];
    })
    console.log(this.licenseOnComplianceCommunity);
    this.statsApi.statsLicenseOnComplianceGetMy().subscribe((response) => {
      this.licenseOnComplianceMy = [{"name": "License Compliance Index", "value": response}];
    })
    console.log(this.licenseOnComplianceMy);
    }
}