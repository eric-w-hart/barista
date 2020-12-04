import { ScanLogService } from '@app/shared/api/api/scan-log.service';
import { filter, scan, switchMap } from 'rxjs/operators';
import { result } from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-scan-logs',
  templateUrl: './scan-logs.component.html',
  styleUrls: ['./scan-logs.component.scss'],
})
export class ScanLogsComponent implements OnInit {
  constructor(private route: ActivatedRoute, private scanLogService: ScanLogService) {}
  isLoadingScanLogs = false;
  scanLogs$: string;

  ngOnInit() {
    const scanId = this.route.snapshot.paramMap.get('scanId');
    this.scanLogService.scanLogByScanIdIdGet(Number(scanId)).subscribe((response) => {
      let dataNames: string[] = response.map((item) => item.log);
      this.scanLogs$ = dataNames.toString();
      this.isLoadingScanLogs = false;
    });
  }

  download() {
    // this.projectApiService.projectIdAttributionDownload(this.project.id.toString()).subscribe((response) => {
    //   const blob: any = new Blob([response], { type: 'text/plain; charset=utf-8' });
    //   importedSaveAs(response, 'attribution.txt');
    // });
  }
}
