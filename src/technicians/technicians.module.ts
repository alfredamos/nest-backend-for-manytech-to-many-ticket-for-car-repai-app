import { Module } from '@nestjs/common';
import { TechniciansService } from './technicians.service';
import { TechniciansController } from './technicians.controller';
import {AuthModule} from "../auth/auth.module";
import {PrismaService} from "../prisma/prisma.service";

@Module({
  imports: [AuthModule],
  controllers: [TechniciansController],
  providers: [TechniciansService, PrismaService],
})
export class TechniciansModule {}
