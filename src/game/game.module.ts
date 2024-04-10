import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { OrmModule } from '../orm/orm.module';

@Module({
  providers: [GameService],
  controllers: [GameController],
  imports: [OrmModule],
  exports: [GameService],
})
export class GameModule {}
