import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrmModule } from './orm/orm.module';
import { LobbyModule } from './lobby/lobby.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [OrmModule, LobbyModule, GameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
