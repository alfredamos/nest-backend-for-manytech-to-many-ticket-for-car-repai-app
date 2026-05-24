import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma/client';
import {adapterParameters} from "../utils/prismaConnectionPool.util";

dotenv.config();

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaMariaDb({
      user: process.env['USER'],
      password: process.env['PASSWORD'],
      host: process.env['HOST'],
      database: process.env['DATABASE'],
      connectionLimit: parseInt(process.env['CONNECTION_LIMIT'] as string),
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
