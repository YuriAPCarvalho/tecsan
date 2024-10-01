import { Test, TestingModule } from '@nestjs/testing';
import { TransferenciasController } from './transferencias.controller';
import { TransferenciasService } from './transferencias.service';

describe('TransferenciasController', () => {
  let controller: TransferenciasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferenciasController],
      providers: [TransferenciasService],
    }).compile();

    controller = module.get<TransferenciasController>(TransferenciasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
