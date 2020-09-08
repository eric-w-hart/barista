import { ProjectAttribution } from '@app/models/ProjectAttribution';
import { AppServiceBase } from '@app/services/app-service-base/app-base.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectAttributionService extends AppServiceBase<ProjectAttribution> {
  private logger = new Logger('ProjectAttributionService');

  constructor(@InjectRepository(ProjectAttribution) repo) {
    super(repo);
  }

  async insertAttribution(partial: ProjectAttribution) {
    let projectAttribution = await this.db.findOne({ where: { project: partial.project.id } });
    this.logger.debug('found it = ' + projectAttribution);
    if (projectAttribution) {
      projectAttribution.attribution = partial.attribution;
    } else {
      projectAttribution = await this.db.create(partial);
    }
    await projectAttribution.save();
    return projectAttribution;
  }
}
