import { Test, TestingModule } from '@nestjs/testing';

import { DeploymentType } from '@app/models/DeploymentType';
import { ClearlyDefinedService } from '@app/services/clearly-defined/clearly-defined.service';
import { mockRepository } from '@app/shared/util/test/Repository.mock';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProjectDevelopmentTypeService', () => {
  let service: ClearlyDefinedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClearlyDefinedService,
        {
          provide: getRepositoryToken(DeploymentType),
          useClass: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ClearlyDefinedService>(ClearlyDefinedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
