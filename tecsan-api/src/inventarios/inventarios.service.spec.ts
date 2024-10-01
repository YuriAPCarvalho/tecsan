import { Test, TestingModule } from '@nestjs/testing';
import { InvetariosService } from './invetarios.service';

describe('InvetariosService', () => {
  let service: InvetariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvetariosService],
    }).compile();

    service = module.get<InvetariosService>(InvetariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
