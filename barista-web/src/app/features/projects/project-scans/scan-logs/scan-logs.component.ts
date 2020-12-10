import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScanLogService } from '@app/shared/api/api/scan-log.service';
import { saveAs as importedSaveAs } from 'file-saver';

@Component({
  selector: 'app-scan-logs',
  templateUrl: './scan-logs.component.html',
  styleUrls: ['./scan-logs.component.scss'],
})
export class ScanLogsComponent implements OnInit {
  constructor(private route: ActivatedRoute, private scanLogService: ScanLogService) {}
  isLoadingScanLogs = false;
  scanId: string;
  scanLogs$: string;

  download() {
    this.scanLogService.scanLogByScanIdIdGet(Number(this.scanId)).subscribe((response) => {
      const scanLogs: string[] = response.map((item) => item.log);
      const blob: any = new Blob([scanLogs.toString()], { type: 'text/plain; charset=utf-8' });
      importedSaveAs(blob, 'scan.log');
    });
  }

  ngOnInit() {
    this.scanId = this.route.snapshot.paramMap.get('scanId');
    this.scanLogService.scanLogByScanIdIdGet(Number(this.scanId)).subscribe((response) => {
      const scanLogs: string[] = response.map((item) => item.log);
      this.scanLogs$ = scanLogs.toString();
      this.isLoadingScanLogs = false;
    });
  }
}
