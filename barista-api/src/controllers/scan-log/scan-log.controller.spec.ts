import { Test, TestingModule } from '@nestjs/testing';
import { ScanLogController } from './scan-log.controller';

describe('ScanLog Controller', () => {
  let controller: ScanLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScanLogController],
    }).compile();

    controller = module.get<ScanLogController>(ScanLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
