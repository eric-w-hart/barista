import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  TemplateRef,
  ContentChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ProjectDevelopmentTypeEnum } from '@app/features/projects/project-development-type.enum';
import { Project, ProjectApiService, UserApiService } from '@app/shared/api';
import { AppDatatableComponent } from '@app/shared/app-components/datatable/app-datatable.component';
import { isEmpty } from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { DataGridColumn } from '@app/shared/app-components/datagrid/data-grid-column';

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
  ) {}

  columns: DataGridColumn[] = [];
  filter: string;
  @ViewChild('nameTemplate', { static: true }) nameTemplate;
  @Input() projectDataTableType: ProjectDataTableType | ProjectDevelopmentTypeEnum;
  @ViewChild('projectsSearchInput')
  projectsSearchInput: ElementRef;
  @ViewChild('searchProjectsDataTable')
  selected = [];
  selectedIndex = 0;
  selectedProject: Project;
  @ContentChild(TemplateRef) statusTemplate: TemplateRef<ElementRef>;
  // @ViewChild('statusTemplate', { static: true }) statusTemplate;
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
            this.projects.sort((a, b) => (a.name > b.name ? 1 : -1));
            console.log(this.projects);
            this.loading = false;
          });
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
            this.projects.sort((a, b) => (a.name > b.name ? 1 : -1));
            console.log(this.projects);
            this.loading = false;
          });
      }
    }
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {}

  cols: any[];
  projects: any = [];
  sortMode: string = 'single';
  _selectedColumns: any[];
  loading: boolean;
  exportColumns: any[];
  exportName = 'BaristaExport';
  ngOnInit() {
    this.loading = true;
    this.columns = [
      { header: 'Project Name', field: 'name', columnType: 'text', sortable: true, filter: true },
      { header: 'Git URL', field: 'gitUrl', columnType: 'text', sortable: true, filter: true },
      { header: 'ASKID', field: 'askID', columnType: 'text', sortable: true, filter: true, width: '100' },
      {
        header: 'Status',
        field: 'id',
        columnType: 'statusTemplate',
      },
    ];

    this.getResults(5000);
  }

  onSelect({ selected }) {
    return this.router.navigate(['project', selected[0].id]);
  }
  onRowSelect(event) {
    console.log('selected');
    this.router.navigate(['project', this.selectedProject.id]);
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }
}
