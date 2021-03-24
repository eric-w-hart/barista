import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectDevelopmentTypeEnum } from '@app/features/projects/project-development-type.enum';
import { Project, ProjectApiService, UserApiService } from '@app/shared/api';
import { AppDatatableComponent } from '@app/shared/app-components/datatable/app-datatable.component';
import IDataTableColumns from '@app/shared/interfaces/IDataTableColumns';
import { isEmpty } from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';


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

  columns: IDataTableColumns[] = [];
  filter: string;
  @ViewChild('nameTemplate', { static: true }) nameTemplate;
  @Input() projectDataTableType: ProjectDataTableType | ProjectDevelopmentTypeEnum;
  @ViewChild('projectsSearchInput')
  projectsSearchInput: ElementRef;
  @ViewChild('searchProjectsDataTable')
  searchProjectsDataTable: AppDatatableComponent;
  selected = [];
  selectedIndex = 0;
  selectedProject : Project;
  @ViewChild('statusTemplate', { static: true }) statusTemplate;
  subscribedToEvent = false;

  getName(row: Project) {
    let name = row.name;

    if (!isEmpty(row.currentVersion)) {
      name = `${name} v${row.currentVersion}`;
    }

    return name;
  }

  getPagedResults(query: any): Observable<any> {
    switch (this.projectDataTableType) {
      case ProjectDataTableType.user: {
        return this.userApiService.userProjectsGet(this.filter || '', query.perPage || 50, query.page || 0);
      }
      default: {
        // Internal or community
        return this.projectApiService.projectSearchGet(
          this.projectDataTableType || 'internal',
          query.perPage || 50,
          query.page || 0,
          this.filter || '',
        );
      }
    }
  }

  ngAfterViewInit(): void {
    this.subscribedToEvent = true;
    fromEvent(this.projectsSearchInput.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        filter(res => res.length > 2 || res.length === 0),
        debounceTime(500),
        distinctUntilChanged(),
        untilDestroyed(this),
      )
      .subscribe((text: string) => {
        this.filter = text;
        this.searchProjectsDataTable.refresh();
        console.log(this.searchProjectsDataTable);
      });
  }

  ngOnDestroy(): void {}
cols : any[];
projects : any = [];
sortMode : string = 'single';
_selectedColumns: any[];
  ngOnInit() {
    this.columns = [
      { name: 'Project Name', prop: 'name', flexGrow: 1, canSort: true, canFilter: true },
      { name: 'Git URL', prop: 'gitUrl', flexGrow: 1,canSort: true, canFilter: true  },
      { name: 'ASKID', prop: 'askID',canSort: true, canFilter: true },
      {
        name: 'Status',
        prop: 'id',
        flexGrow: 1,
        cellTemplate: this.statusTemplate,
      },
    ];

    this._selectedColumns = this.columns;

    this.projectApiService.projectSearchGet(
      this.projectDataTableType || 'internal',
      50,
       0,
      this.filter || '',
    ).subscribe((response: any) => {
      this.projects= response.data;
      console.log(this.projects);
    });
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
  this._selectedColumns = this.columns.filter(col => val.includes(col));
}

}
