import { Test, TestingModule } from '@nestjs/testing';
import { SaldosService } from './saldos.service';

describe('SaldosService', () => {
  let service: SaldosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaldosService],
    }).compile();

    service = module.get<SaldosService>(SaldosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
