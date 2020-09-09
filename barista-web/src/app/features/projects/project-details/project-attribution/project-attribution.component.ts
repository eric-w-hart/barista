import { Project } from './../../../../shared/api/model/project';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectApiService } from '@app/shared/api';
import { saveAs as importedSaveAs } from 'file-saver';

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

  download() {
    this.projectApiService.projectIdAttributionDownload(this.project.id.toString()).subscribe((response) => {
      const blob: any = new Blob([response], { type: 'text/plain; charset=utf-8' });
      importedSaveAs(response, 'attribution.txt');
    });
  }
}
