import { Test, TestingModule } from '@nestjs/testing';

import { goLicensesSimpleMockOutput } from './go-licenses-output.mock';
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

  it('should convert CsvResults to Json', async () => {
    const actual = service.convertCsvResultsToJson(goLicensesSimpleMockOutput);
    const expected = [
      ['github.com/vsurge/hello-insecure-go', 'https://github.com/vsurge/hello-insecure-go/blob/master/LICENSE', 'MIT'],
    ];

    expect(actual).toEqual(expected);
  });
});
