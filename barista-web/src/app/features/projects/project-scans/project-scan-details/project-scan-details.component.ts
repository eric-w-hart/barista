import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '@app/shared/+state/project/project.service';
import IBreadcrumb from '@app/shared/app-components/breadcrumbs/IBreadcrumb';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AuthService } from '@app/features/auth/auth.service';

@Component({
  selector: 'app-project-scan-details',
  templateUrl: './project-scan-details.component.html',
  styleUrls: ['./project-scan-details.component.scss'],
})
export class ProjectScanDetailsComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private authService: AuthService,
  ) {}
  breadcrumbs: IBreadcrumb[];

  selectedTabIndex: number;

  ngOnDestroy() {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.selectedTabIndex = params.tab ? params.tab : 0;
    });

    this.route.paramMap.subscribe(async (params) => {
      const projectId = Number(params.get('projectId'));

      this.projectService.setFilter(projectId); // ngrx entity data service and entity service
      this.projectService.filteredEntities$ // subscribe to observables, look at entity-metadata.ts
        .pipe(untilDestroyed(this))
        .subscribe((projects) => {
          if (projects.length > 0) {
            const projectDetail = { ...projects[0] };
            let projectListType = [
              {
                url: '/projects/organization',
                title: 'Organization Projects',
              },
            ];

            if (projectDetail.developmentType.code === 'community') {
              projectListType = [
                {
                  url: '/projects/community',
                  title: 'Community Projects',
                },
              ];
            }
            if (projectDetail.userId) {
              if (this.authService.isProjectOwnerNonAdmin(projectDetail)) {
                projectListType = [
                  {
                    url: '/projects/user',
                    title: 'User Projects',
                  },
                ];
              }
            }
            this.breadcrumbs = [
              ...projectListType,
              { url: `/project/${projectId}`, title: `${projectDetail.name}` },
              {
                url: `/project/${projectId}`,
                title: `Scans`,
                params: { tab: 2 },
              },
              { url: ``, title: `Results` },
            ];
          } else {
            this.projectService.getByKey(projectId);
          }
        });
    });
  }
}
