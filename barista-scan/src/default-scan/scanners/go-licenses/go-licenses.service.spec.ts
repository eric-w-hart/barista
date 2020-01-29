import { Test, TestingModule } from '@nestjs/testing';

import * as LicenseCheckerOutputMock from './go-licenses-output.mock';
import { GoLicensesService } from './go-licenses.service';

describe('LicenseCheckerService', () => {
  let service: GoLicensesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoLicensesService,
        { provide: 'ScanService', useClass: jest.fn() },
        { provide: 'LicenseService', useClass: jest.fn() },
        { provide: 'LicenseScanResultService', useClass: jest.fn() },
        { provide: 'LicenseScanResultItemService', useClass: jest.fn() },
      ],
    }).compile();

    service = module.get<GoLicensesService>(GoLicensesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should extract license objects', async () => {
    const key = '@babel/code-frame@7.0.0';
    const input = LicenseCheckerOutputMock[key];
    const actual = await service.licenseScanResultItemFromJson(key, input);
    expect(actual).toBeDefined();
  });
});
