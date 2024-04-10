import { Controller, Post } from "@nestjs/common";
import { LobbyService } from "./lobby.service";

@Controller('lobby')
export class LobbyController {
  constructor(private readonly service: LobbyService) {
  }

  @Post()
  createLobby(){
    return this.service.createLobby()
  }
}
