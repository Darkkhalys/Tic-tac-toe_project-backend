import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly service: GameService) {}

  @Get('/:sessionId')
  getGame(@Param('sessionId') sessionId: string) {
    return this.service.getGame(sessionId);
  }

  @Post('/:sessionId/play')
  postMove(
    @Param('sessionId') sessionId: string,
    @Body() move: { x: number; y: number },
  ) {
    return this.service.postMove(sessionId, move);
  }
}
