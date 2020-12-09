import { ScanLog } from '@app/models/ScanLog';
import { AppServiceBase } from '@app/services/app-service-base/app-base.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ScanLogService extends AppServiceBase<ScanLog> {
  constructor(@InjectRepository(ScanLog) repo) {
    super(repo);
  }
}
