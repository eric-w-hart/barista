import { filter, switchMap } from 'rxjs/operators';
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
  constructor(private route: ActivatedRoute) {}
  isLoadingScanLogs = true;
  scanLogs$: Observable<string>;

  ngOnInit() {
    const scanId = this.route.snapshot.paramMap.get('scanId');

    // this.scanLogs$ = this.scanLogService.scanLogByScanIdIdGet(Number(scanId)).pipe(
    //   untilDestroyed(this),
    //   filter((result) => result.length > 0),
    //   switchMap((result) => {
    //     this.isLoadingScanLogs = false;
    //     return of(result[0].log);
    //   }),
    // );
  }

  download() {
    // this.projectApiService.projectIdAttributionDownload(this.project.id.toString()).subscribe((response) => {
    //   const blob: any = new Blob([response], { type: 'text/plain; charset=utf-8' });
    //   importedSaveAs(response, 'attribution.txt');
    // });
  }
}
