import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthService, AuthServiceStatus } from '@app/features/auth/auth.service';
import { StatsApiService } from '@app/shared/api/api/stats-api.service';

interface Threshold{
  low: number,
  medium: number,
  high: number,
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnChanges {
  constructor(private statsApi: StatsApiService) {}

  isLoggedIn: boolean;
  dataset: string;

  /* Data Variables */
  topComponentLicenseData: any;
  topComponentScansData: any;
  topVulnerabilities: any;
  projectsAddedMonthly: any;
  monthlyProjectScans: any;
  highVulnerability: any;
  licenseOnCompliance: any;
  vulnerabilityThreshold: Threshold = {
    low: 2.5,
    medium: 5,
    high: 7.5,
  }
  licenseThreshold: Threshold = {
    low: 1,
    medium: 2.5,
    high: 5,
  }

  /**
   * All initialization of the datasets & graphs occurs here.
   * Handles subscribing of data async's into data vars.
   */
  ngOnInit(): void {
    this.dataset = 'organization';
    this.getDatasets();
  }

  ngOnChanges():void {
    this.getDatasets();
  }

  changeDataset(dataset: string){
    this.dataset = dataset;
    this.ngOnChanges();
  }

  getDatasets(){
    this.isLoggedIn = AuthService.isLoggedIn;

    this.statsApi.statsComponentsGet(this.dataset).subscribe((response) => {
      this.topComponentLicenseData = response;
    });

    this.statsApi.statsVulnerabilitiesGet('organization').subscribe((response) => {
      this.topVulnerabilities = response;
    });

    this.statsApi.statsComponentsScansGet(this.dataset).subscribe((response) => {
      this.topComponentScansData = response;
    })

    this.statsApi.statsProjectsGet('organization').subscribe((response) => {
      response = this.parseMonth(response);
      this.projectsAddedMonthly = response;
    })

    this.statsApi.statsProjectsScansGet('organization').subscribe((response) => {
      response = this.parseMonth(response);
      this.monthlyProjectScans = response;
    })

    this.statsApi.statsHighVulnerabilityGet(this.dataset).subscribe((response) => {
      var displayName = this.displaySeverity(response, this.vulnerabilityThreshold);
      this.highVulnerability = [{"name": displayName, "value": response}];
    })

    this.statsApi.statsLicenseOnComplianceGet(this.dataset).subscribe((response) => {
      var displayName = this.displaySeverity(response, this.licenseThreshold);
      this.licenseOnCompliance = [{"name": displayName, "value": response}];
    })
  }

  displaySeverity(n: any, t: Threshold){
    if(n < t.low){ return 'LOW' }
    else if(n < t.medium){ return 'MEDIUM' }
    else if(n < t.high){ return 'HIGH' }
    else { return 'CRITICAL' }
  }

  parseMonth(data: any){
    for (var item of data){
      switch (item.name.substring(5, 7)) {
        case "01": {
          item.name = "Jan" + " '" + item.name.substring(2, 4);
          break;
        }
        case "02": {
          item.name = "Feb" + " '" + item.name.substring(2, 4);
          break;
        }
        case "03": {
          item.name = "Mar" + " '" + item.name.substring(2, 4);
          break;
        }
        case "04": {
          item.name = "Apr" + " '" + item.name.substring(2, 4);
          break;
        }
        case "05": {
          item.name = "May" + " '" + item.name.substring(2, 4);
          break;
        }
        case "06": {
          item.name = "Jun" + " '" + item.name.substring(2, 4);
          break;
        }
        case "07": {
          item.name = "Jul" + " '" + item.name.substring(2, 4);
          break;
        }
        case "08": {
          item.name = "Aug" + " '" + item.name.substring(2, 4);
          break;
        }
        case "09": {
          item.name = "Sep" + " '" + item.name.substring(2, 4);
          break;
        }
        case "10": {
          item.name = "Oct" + " '" + item.name.substring(2, 4);
          break;
        }
        case "11": {
          item.name = "Nov" + " '" + item.name.substring(2, 4);
          break;
        }
        case "12": {
          item.name = "Dec" + " '" + item.name.substring(2, 4);
          break;
        }
        default: {
          item.name = "Unknown" + " '" + item.name.substring(2, 4);
          break;
        }
      }
    }

    return data;
  }
}
