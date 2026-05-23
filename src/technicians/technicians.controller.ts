import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TechniciansService } from './technicians.service';

@Controller('technicians')
export class TechniciansController {
  constructor(private readonly techniciansService: TechniciansService) {}


}
