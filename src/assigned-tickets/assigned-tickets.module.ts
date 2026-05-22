import { Module } from '@nestjs/common';
import { AssignedTicketsService } from './assigned-tickets.service';
import { AssignedTicketsController } from './assigned-tickets.controller';

@Module({
  controllers: [AssignedTicketsController],
  providers: [AssignedTicketsService],
})
export class AssignedTicketsModule {}
