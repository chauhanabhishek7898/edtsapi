import { Test, TestingModule } from '@nestjs/testing';
import { EdtsService } from './edts.service';

describe('EdtsService', () => {
  let service: EdtsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EdtsService],
    }).compile();

    service = module.get<EdtsService>(EdtsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
