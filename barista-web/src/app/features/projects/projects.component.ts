import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectDevelopmentTypeEnum } from '@app/features/projects/project-development-type.enum';
import { Project, ProjectApiService, UserApiService, SystemConfiguration } from '@app/shared/api';
import { isEmpty } from 'lodash';
import { Observable } from 'rxjs';
import { DataGridColumn } from '@app/shared/app-components/datagrid/data-grid-column';
import { AppDataGridComponent } from '@app/shared/app-components/datagrid/app-datagrid.component';
import { SystemConfigurationService } from '@app/shared/+state/systemConfiguration/system-configuration.service';

enum ProjectDataTableType {
  user = 'user',
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private projectApiService: ProjectApiService,
    private userApiService: UserApiService,
    private router: Router,
    private route: ActivatedRoute,
    private systemConfigService: SystemConfigurationService,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.initialFilter = params['filter'];
    });
  }

  @Input() projectDataTableType: ProjectDataTableType | ProjectDevelopmentTypeEnum;

  @ViewChild('ProjectsDataGrid') projectsDataGrid: AppDataGridComponent;
  @ViewChild('nameTemplate', { static: true }) nameTemplate;
  @ViewChild('licenseStatusTemplate', { static: true }) licenseStatusTemplate;
  @ViewChild('securityStatusTemplate', { static: true }) securityStatusTemplate;

  columns: DataGridColumn[] = [];
  filter: string;
  initialFilter: string;
  projects: any = [];
  sortMode: string = 'single';
  loading: boolean;
  systemConfiguration: Observable<SystemConfiguration>;
  projectIdHeader: string;
  statuses: any[];

  subscribedToEvent = false;

  getResults() {
    switch (this.projectDataTableType) {
      case ProjectDataTableType.user: {
        this.projectApiService.projectsWithStatusSearchGet('true').subscribe((response: any) => {
          this.projects = response;

          // This is crazy....without it, sometimes the spinner won't go away.
          this.sleep(500).then(() => {
            this.loading = false;
          });
        });
        break;
      }
      default: {
        this.projectApiService
          .projectsWithStatusSearchGet(null, null, `developmentType.code||eq||${this.projectDataTableType}`)
          .subscribe((response: any) => {
            this.projects = response;

            // This is crazy....without it, sometimes the spinner won't go away.
            this.sleep(500).then(() => {
              this.loading = false;
            });
          });
      }
    }
  }

  ngAfterViewInit(): void {
    this.getResults();
  }

  ngOnDestroy(): void {}

  ngOnInit() {
    this.systemConfigService.apiService.systemConfigurationIdGet('default').subscribe((data) => {
      this.projectIdHeader = data.askIdDisplayName ? data.askIdDisplayName : 'Project ID';

      this.loading = true;
      this.columns = [
        {
          header: 'Project Name',
          field: 'name',
          sortable: true,
          filter: true,
          cellTemplate: this.nameTemplate,
        },
        { header: 'Git URL', field: 'gitUrl', columnType: 'text', sortable: true, filter: true },
        {
          header: this.projectIdHeader,
          field: 'askID',
          columnType: 'text',
          sortable: true,
          filter: true,
          width: '100',
        },
        {
          header: 'License State',
          field: 'latestLicenseStatus',
          sortable: true,
          filter: false,
          cellTemplate: this.licenseStatusTemplate,
        },
        {
          header: 'Security State',
          field: 'latestSecurityStatus',
          sortable: true,
          filter: false,
          cellTemplate: this.securityStatusTemplate,
        },
      ];
    });
  }

  onRowSelect(event) {
    const project = event?.data as Project;
    this.router.navigate(['project', project.id]);
  }

  getName(row: Project) {
    let name = row.name;

    if (!isEmpty(row.currentVersion)) {
      name = `${name} v${row.currentVersion}`;
    }

    return name;
  }

  // sleep time expects milliseconds
  sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
}
