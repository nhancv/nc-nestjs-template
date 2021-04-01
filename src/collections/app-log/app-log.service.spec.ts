import { Test, TestingModule } from '@nestjs/testing';
import { AppLogService } from './app-log.service';

describe('AppLogService', () => {
  let service: AppLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppLogService],
    }).compile();

    service = module.get<AppLogService>(AppLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
