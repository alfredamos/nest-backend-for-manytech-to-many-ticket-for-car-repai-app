import { Module } from '@nestjs/common';
import { AssignedTicketsService } from './assigned-tickets.service';
import { AssignedTicketsController } from './assigned-tickets.controller';
import {PrismaService} from "../prisma/prisma.service";

@Module({
  controllers: [AssignedTicketsController],
  providers: [AssignedTicketsService, PrismaService],
})
export class AssignedTicketsModule {}
