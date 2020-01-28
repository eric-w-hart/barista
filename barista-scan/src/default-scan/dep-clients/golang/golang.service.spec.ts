import { Test, TestingModule } from '@nestjs/testing';

import { GolangService } from './golang.service';

describe('GolangService', () => {
  let service: GolangService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GolangService],
    }).compile();

    service = module.get<GolangService>(GolangService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
