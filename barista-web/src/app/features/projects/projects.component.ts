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
  @ViewChild('statusTemplate', { static: true }) statusTemplate;
  @ViewChild('nameTemplate', { static: true }) nameTemplate;

  columns: DataGridColumn[] = [];
  filter: string;
  initialFilter: string;
  projects: any = [];
  sortMode: string = 'single';
  loading: boolean;
  systemConfiguration: Observable<SystemConfiguration>;
  projectIdHeader: string;

  subscribedToEvent = false;

  getPagedResults(query: any): Observable<any> {
    switch (this.projectDataTableType) {
      case ProjectDataTableType.user: {
        return this.userApiService.userProjectsGet(this.filter || '', query.perPage || 5000, query.page || 0);
      }
      default: {
        // Internal or community
        return this.projectApiService.projectSearchGet(
          this.projectDataTableType || 'internal',
          query.perPage || 5000,
          query.page || 0,
          this.filter || '',
        );
      }
    }
  }

  getResults(query: any) {
    switch (this.projectDataTableType) {
      case ProjectDataTableType.user: {
        this.userApiService
          .userProjectsGet(this.filter || '', query.perPage || 5000, query.page || 0)
          .subscribe((response: any) => {
            this.projects = response.data;
            this.loading = false;
          });
        break;
      }
      default: {
        // Internal or community
        this.projectApiService
          .projectSearchGet(
            this.projectDataTableType || 'internal',
            query.perPage || 5000,
            query.page || 0,
            this.filter || '',
          )
          .subscribe((response: any) => {
            this.projects = response.data;
            this.loading = false;
          });
      }
    }
  }

  ngAfterViewInit(): void {
    this.getResults(5000);
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
          header: 'Status',
          field: 'id',
          cellTemplate: this.statusTemplate,
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
}
