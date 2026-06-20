import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { LeadsService, type CreateLeadDto } from './leads.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('leads')
@UseGuards(AuthGuard)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(@Body() leadData: CreateLeadDto) {
    return this.leadsService.createLead(leadData);
  }

  @Get()
  findAll() {
    return this.leadsService.getLeads();
  }
}
