import {Injectable} from '@nestjs/common';
import {TokenUncheckedCreateInput} from "../generated/prisma/models/Token";
import {PrismaService} from "../prisma/prisma.service";
import {ResponseMessage} from "../utils/responseMessage.util";
import {StatusCodes} from "http-status-codes";

@Injectable()
export class TokensService {
  constructor(private readonly prisma: PrismaService) {}
  async createToken(createTokenDto: TokenUncheckedCreateInput) {
    //----> Create the token
    return this.prisma.token.create({data: createTokenDto});
  }

  async deleteInvalidTokensByUserId(userId: string){
    //----> Delete invalid tokens by user id.
    await this.prisma.token.deleteMany({where: {userId: userId, expired: true, revoked: true}});

    //----> Send back the response.
    return new ResponseMessage("All invalid tokens associated with this user are deleted successfully", "success", StatusCodes.OK);
  }

  async deleteAllInvalidTokens(){
    //----> Delete all invalid tokens.
    await this.prisma.token.deleteMany({where: {expired: true, revoked: true}});

    //----> Send back the response.
    return new ResponseMessage("All invalid tokens deleted successfully", "success", StatusCodes.OK);
  }

  async revokeAllValidTokensByUserId(userId: string){
    //----> Revoke all valid tokens by user id.
    await this.prisma.token.updateMany({where: {userId: userId, expired: false, revoked: false}, data: {revoked: true, expired: true}});

    //----> Send back response.
    return new ResponseMessage("All valid tokens associated with this user are revoked successfully", "success", StatusCodes.OK);
  }


}
