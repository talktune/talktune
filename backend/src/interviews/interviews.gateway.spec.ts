import { Test, TestingModule } from '@nestjs/testing';
import { InterviewsGateway } from './interviews.gateway';
import { InterviewsService } from './interviews.service';

describe('InterviewsGateway', () => {
  let gateway: InterviewsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InterviewsGateway, InterviewsService],
    }).compile();

    gateway = module.get<InterviewsGateway>(InterviewsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
