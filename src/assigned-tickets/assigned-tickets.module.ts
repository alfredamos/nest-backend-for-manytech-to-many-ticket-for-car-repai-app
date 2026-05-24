import { Module } from '@nestjs/common';
import { AssignedTicketsService } from './assigned-tickets.service';
import { AssignedTicketsController } from './assigned-tickets.controller';
import {PrismaService} from "../prisma/prisma.service";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [AssignedTicketsController],
  providers: [AssignedTicketsService, PrismaService],
})
export class AssignedTicketsModule {}
