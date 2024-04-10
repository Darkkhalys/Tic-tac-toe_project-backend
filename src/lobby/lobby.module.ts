import { Module } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { LobbyController } from './lobby.controller';
import { OrmModule } from '../orm/orm.module';
import { GameModule } from '../game/game.module';

@Module({
  providers: [LobbyService],
  controllers: [LobbyController],
  imports: [OrmModule, GameModule],
})
export class LobbyModule {}
