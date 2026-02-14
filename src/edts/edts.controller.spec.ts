import { Test, TestingModule } from '@nestjs/testing';
import { EdtsController } from './edts.controller';
import { EdtsService } from './edts.service';

describe('EdtsController', () => {
  let controller: EdtsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EdtsController],
      providers: [EdtsService],
    }).compile();

    controller = module.get<EdtsController>(EdtsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
