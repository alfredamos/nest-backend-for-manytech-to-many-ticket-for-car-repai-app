import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssignedTicketsService } from './assigned-tickets.service';
import { CreateAssignedTicketDto } from './dto/create-assigned-ticket.dto';
import { UpdateAssignedTicketDto } from './dto/update-assigned-ticket.dto';

@Controller('assigned-tickets')
export class AssignedTicketsController {
  constructor(private readonly assignedTicketsService: AssignedTicketsService) {}

  @Post()
  create(@Body() createAssignedTicketDto: CreateAssignedTicketDto) {
    return this.assignedTicketsService.create(createAssignedTicketDto);
  }

  @Get()
  findAll() {
    return this.assignedTicketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignedTicketsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssignedTicketDto: UpdateAssignedTicketDto) {
    return this.assignedTicketsService.update(+id, updateAssignedTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignedTicketsService.remove(+id);
  }
}
