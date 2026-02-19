import { Body, Controller, Post } from '@nestjs/common';
import { SamAssistantService } from './sam-assistant.service';
import { UserQuestionDto } from './dto';

@Controller('sam-assistant')
export class SamAssistantController {
  constructor(private readonly samAssistantService: SamAssistantService) {}

  @Post('create-thread')
  async createThread() {
    return this.samAssistantService.createThread();
  }

  @Post('user-question')
  async userQuestion(@Body() userQuestionDto: UserQuestionDto) {
    return this.samAssistantService.userQuestion(userQuestionDto);
  }
}
