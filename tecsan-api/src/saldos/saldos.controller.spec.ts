import { Test, TestingModule } from '@nestjs/testing';
import { SaldosController } from './saldos.controller';
import { SaldosService } from './saldos.service';

describe('SaldosController', () => {
  let controller: SaldosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaldosController],
      providers: [SaldosService],
    }).compile();

    controller = module.get<SaldosController>(SaldosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
