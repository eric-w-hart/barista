import { Project } from './../../../../shared/api/model/project';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectApiService } from '@app/shared/api';

@Component({
  selector: 'app-project-attribution',
  templateUrl: './project-attribution.component.html',
  styleUrls: ['./project-attribution.component.scss'],
})
export class ProjectAttributionComponent implements OnInit {
  constructor(private route: ActivatedRoute, private projectApiService: ProjectApiService) {}
  attribution = '';
  isLoadingAttribution = true;
  @Input() project: Project;

  ngOnInit() {
    this.projectApiService.projectIdAttributionGet(this.project.id.toString()).subscribe((response) => {
      this.attribution = response.licenseText;
      this.isLoadingAttribution = false;
    });
  }
  download() {}
}
