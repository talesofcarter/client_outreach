import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { DatabaseService } from '../database.service';

@Module({
  providers: [LeadsService, DatabaseService],
  controllers: [LeadsController],
})
export class LeadsModule {}
