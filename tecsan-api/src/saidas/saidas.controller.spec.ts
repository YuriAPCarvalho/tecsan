import { Test, TestingModule } from '@nestjs/testing';
import { SaidasController } from './saidas.controller';
import { SaidasService } from './saidas.service';

describe('SaidasController', () => {
  let controller: SaidasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaidasController],
      providers: [SaidasService],
    }).compile();

    controller = module.get<SaidasController>(SaidasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
