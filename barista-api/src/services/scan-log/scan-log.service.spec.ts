import { Test, TestingModule } from '@nestjs/testing';

import { ScanLog } from '@app/models';
import { mockRepository } from '@app/shared/util/test/Repository.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ScanLogService } from './scan-log.service';

describe('ScanLogService', () => {
  let service: ScanLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScanLogService,
        {
          provide: getRepositoryToken(ScanLog),
          useClass: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ScanLog>(ScanLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
