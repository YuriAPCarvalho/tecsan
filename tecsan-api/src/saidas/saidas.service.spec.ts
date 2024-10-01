import { Test, TestingModule } from '@nestjs/testing';
import { SaidasService } from './saidas.service';

describe('SaidasService', () => {
  let service: SaidasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaidasService],
    }).compile();

    service = module.get<SaidasService>(SaidasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
