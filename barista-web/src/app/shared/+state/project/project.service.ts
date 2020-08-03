import { Injectable } from '@angular/core';
import { PublicApiService } from '@app/shared/+state/public-api-service';
import { Project, ProjectApiService } from '@app/shared/api';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { AuthService } from '@app/features/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class ProjectService extends EntityCollectionServiceBase<Project> implements PublicApiService {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    public apiService: ProjectApiService,
    public authService: AuthService,
  ) {
    super('Project', serviceElementsFactory);
  }

  breadcrumbProjectType(project: Project) {
    let projectListType = [
      {
        url: '/projects/organization',
        title: 'Organization Projects',
      },
    ];

    if (project.developmentType.code === 'community') {
      projectListType = [
        {
          url: '/projects/community',
          title: 'Community Projects',
        },
      ];
    }
    if (project.userId) {
      if (this.authService.isProjectOwnerNonAdmin(project)) {
        projectListType = [
          {
            url: '/projects/user',
            title: 'User Projects',
          },
        ];
      }
    }

    return projectListType;
  }
}
