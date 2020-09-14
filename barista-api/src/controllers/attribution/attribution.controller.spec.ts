import { ScanService } from '@app/services/scan/scan.service';
import { Test, TestingModule } from '@nestjs/testing';

import { CqrsModule } from '@nestjs/cqrs';
import { AttributionController } from './attribution';

describe('Attribution Controller', () => {
  let controller: AttributionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [AttributionController],
      providers: [
        {
          provide: ScanService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AttributionController>(AttributionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
