import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadsService.getLeadById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.leadsService.updateLead(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leadsService.deleteLead(id);
  }
}
