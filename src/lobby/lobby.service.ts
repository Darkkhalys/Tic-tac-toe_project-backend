import { Injectable } from '@nestjs/common';
import { OrmService } from '../orm/orm.service';
import { GameService } from '../game/game.service';

@Injectable()
export class LobbyService {
  constructor(
    private readonly prisma: OrmService,
    private readonly game: GameService,
  ) {}

  async createLobby() {
    const lobbies = await this.prisma.lobby.findFirst();

    if (!lobbies) {
      const newLobby = await this.prisma.lobby.create({
        data: {
          timestamp: new Date(Date.now()).toISOString(),
        },
      });

      return newLobby.sessionId;
    } else {
      const newPlayer = await this.prisma.lobby.create({
        data: { timestamp: new Date(Date.now()).toISOString() },
      });

      await this.game.createGame({
        player1Id: lobbies.sessionId,
        player2Id: newPlayer.sessionId,
      });

      await this.prisma.lobby.deleteMany();
    }
  }
}
