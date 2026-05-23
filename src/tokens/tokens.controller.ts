import { Controller, Param, Delete } from '@nestjs/common';
import { TokensService } from './tokens.service';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Delete('all/delete-all')
  async deleteAllInvalidTokens(){
    return await this.tokensService.deleteAllInvalidTokens();
  }

  @Delete('delete-by-user-id/:userId')
  async deleteInvalidTokensByUserId(@Param('userId')userId: string){
    return await this.tokensService.deleteInvalidTokensByUserId(userId);
  }




}
