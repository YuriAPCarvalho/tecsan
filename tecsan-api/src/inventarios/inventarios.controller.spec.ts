import { Test, TestingModule } from '@nestjs/testing';
import { InvetariosController } from './invetarios.controller';
import { InvetariosService } from './invetarios.service';

describe('InvetariosController', () => {
  let controller: InvetariosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvetariosController],
      providers: [InvetariosService],
    }).compile();

    controller = module.get<InvetariosController>(InvetariosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
