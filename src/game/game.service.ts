import { BadRequestException, Injectable } from '@nestjs/common';
import { OrmService } from '../orm/orm.service';

export class CreateGameDto {
  player1Id: string;
  player2Id: string;
}

@Injectable()
export class GameService {
  constructor(private readonly prisma: OrmService) {}

  async createGame(gameInput: CreateGameDto) {
    const board: string[][] = Array.from({ length: 30 }, () =>
      Array(30).fill(' '),
    );
    return this.prisma.game.create({
      data: {
        player1Id: gameInput.player1Id,
        player2Id: gameInput.player2Id,
        lastActionTimestamp: new Date(Date.now()).toISOString(),
        nextPlayer: gameInput.player1Id,
        state: board,
      },
    });
  }

  async getGame(sessionId: string) {
    return this.prisma.game.findFirst({
      where: {
        OR: [
          {
            player1Id: sessionId,
          },
          {
            player2Id: sessionId,
          },
        ],
      },
    });
  }

  async postMove(sessionId: string, move: { x: number; y: number }) {
    const game = await this.getGame(sessionId);
    const board: string[][] = JSON.parse(JSON.stringify(game.state));

    if (
      move.x >= 0 &&
      move.x < board.length &&
      move.y >= 0 &&
      move.y < board[0].length
    ) {
      if (board[move.x][move.y] === ' ') {
        if (game.player1Id === sessionId) {
          board[move.x][move.y] = 'X';
        } else {
          board[move.x][move.y] = 'O';
        }

        await this.prisma.game.update({
          where: { gameId: game.gameId },
          data: {
            state: board,
            lastActionTimestamp: new Date(Date.now()).toISOString(),
          },
        });
        const win = await this.checkWin(board, sessionId);
        if (win === false) {
          return true;
        } else {
          return win;
        }
      } else {
        throw new BadRequestException('A hely már foglalat');
      }
    } else {
      throw new BadRequestException('Érvénytelen hely');
    }
  }

  async checkWin(board: string[][], sessionId: string) {
    let win: boolean = false;
    const game = await this.getGame(sessionId);

    for (let row = 0; row < board.length - 4; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (
          board[row][col] === board[row + 1][col] &&
          board[row][col] === board[row + 2][col] &&
          board[row][col] === board[row + 3][col] &&
          board[row][col] === board[row + 4][col] &&
          board[row][col] !== ' '
        ) {
          win = true;
        }
      }
    }

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length - 4; col++) {
        if (
          board[row][col] === board[row][col + 1] &&
          board[row][col] === board[row][col + 2] &&
          board[row][col] === board[row][col + 3] &&
          board[row][col] === board[row][col + 4] &&
          board[row][col] !== ' '
        ) {
          win = true;
        }
      }
    }

    for (let row = 0; row < board.length - 4; row++) {
      for (let col = 0; col < board[row].length - 4; col++) {
        if (
          board[row][col] === board[row + 1][col + 1] &&
          board[row][col] === board[row + 2][col + 2] &&
          board[row][col] === board[row + 3][col + 3] &&
          board[row][col] === board[row + 4][col + 4] &&
          board[row][col] !== ' '
        ) {
          win = true;
        }
      }
    }

    for (let row = 0; row < board.length - 4; row++) {
      for (let col = 4; col < board[row].length; col++) {
        if (
          board[row][col] === board[row + 1][col - 1] &&
          board[row][col] === board[row + 2][col - 2] &&
          board[row][col] === board[row + 3][col - 3] &&
          board[row][col] === board[row + 4][col - 4] &&
          board[row][col] !== ' '
        ) {
          win = true;
        }
      }
    }

    if (win) {
      if (game.nextPlayer === game.player2Id) {
        return 'X won!';
      } else {
        return 'O won!';
      }
    }

    return false;
  }
}
