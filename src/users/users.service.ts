import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {fromUserToUserDto} from "../auth/dto/user.dto";

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {
    }
    async deleteUserById(id: string) {
        //----> Check for user existence.
        await this.getOneUser(id);

        //----> Delete the user.
        const deletedUser = await this.prisma.user.delete({where: {id}});

        //----> Return the deleted user.
        return fromUserToUserDto(deletedUser);
    }

    async getUserById(id: string) {
        //----> Get the user by id.
        const user = await this.getOneUser(id);

        //----> Send back response.
        return fromUserToUserDto(user);
    }

    async getAllUsers() {
        //----> Get all users.
        const users = await this.prisma.user.findMany();

        //----> Send back response.
        return users?.map(user => fromUserToUserDto(user));
    }

    private async getOneUser(id: string) {
        //----> Get the user by id
        const user = await this.prisma.user.findUnique({where: {id}});

        //----> Check for null user.
        if (!user) {
            throw new NotFoundException("User not found in db!");
        }

        //----> Return the user.
        return user;
    }
}
