import { Controller, Param, Delete } from '@nestjs/common';
import { TokensService } from './tokens.service';
import {Role} from "../generated/prisma/enums";
import {Roles} from "../decorators/role.decorator";

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Roles(Role.Admin)
  @Delete('all/delete-all')
  async deleteAllInvalidTokens(){
    return await this.tokensService.deleteAllInvalidTokens();
  }

  @Roles(Role.Admin, Role.User)
  @Delete('delete-by-user-id/:userId')
  async deleteInvalidTokensByUserId(@Param('userId')userId: string){
    return await this.tokensService.deleteInvalidTokensByUserId(userId);
  }




}
