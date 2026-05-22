import { Injectable } from '@nestjs/common';
import { CreateAssignedTicketDto } from './dto/create-assigned-ticket.dto';
import { UpdateAssignedTicketDto } from './dto/update-assigned-ticket.dto';

@Injectable()
export class AssignedTicketsService {
  create(createAssignedTicketDto: CreateAssignedTicketDto) {
    return 'This action adds a new assignedTicket';
  }

  findAll() {
    return `This action returns all assignedTickets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assignedTicket`;
  }

  update(id: number, updateAssignedTicketDto: UpdateAssignedTicketDto) {
    return `This action updates a #${id} assignedTicket`;
  }

  remove(id: number) {
    return `This action removes a #${id} assignedTicket`;
  }
}
