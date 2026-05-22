import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { TechniciansModule } from './technicians/technicians.module';
import { TicketsModule } from './tickets/tickets.module';
import { UsersModule } from './users/users.module';
import { AssignedTicketsModule } from './assigned-tickets/assigned-tickets.module';

@Module({
  imports: [
    AuthModule,
    CustomersModule,
    TechniciansModule,
    TicketsModule,
    UsersModule,
    AssignedTicketsModule,
  ],
  providers: [],
})
export class AppModule {}
