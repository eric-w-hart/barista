import { getRepositoryToken } from '@nestjs/typeorm';
import { mockRepository } from '@app/shared/util/test/Repository.mock';
import { ProjectAttribution } from '@app/models';
import { ProjectAttributionService } from '@app/services/project-attribution/project-attribution.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('ProjectAttributionService', () => {
  let service: ProjectAttributionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectAttributionService,
        {
          provide: getRepositoryToken(ProjectAttribution),
          useClass: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectAttributionService>(ProjectAttributionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
