import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../database.service';

export interface CreateLeadDto {
  businessName: string;
  region: string;
  category: string;
  website?: string;
  email?: string;
  phone?: string;
  issues: string;
}

export interface LeadRow {
  id: string;
  business_name: string;
  city_region: string;
  website_url: string | null;
  email: string | null;
  phone: string | null;
  key_issues_found: string;
  status:
    | 'not_contacted'
    | 'contacted'
    | 'follow_up_scheduled'
    | 'negotiating'
    | 'won'
    | 'lost';
  category: string;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class LeadsService {
  constructor(private db: DatabaseService) {}

  async createLead(data: CreateLeadDto): Promise<LeadRow> {
    try {
      const query = `
        INSERT INTO leads 
        (business_name, city_region, category, website_url, email, phone, key_issues_found) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *;
      `;

      const values = [
        data.businessName,
        data.region,
        data.category,
        data.website || null,
        data.email || null,
        data.phone || null,
        data.issues,
      ];

      const result = await this.db.query<LeadRow>(query, values);

      return result.rows[0];
    } catch (error) {
      console.error('Database Insert Error:', error);
      throw new InternalServerErrorException(
        'Failed to save the lead to the database',
      );
    }
  }

  async getLeads(): Promise<LeadRow[]> {
    try {
      const query = `SELECT * FROM leads ORDER BY created_at DESC;`;
      const result = await this.db.query<LeadRow>(query);
      return result.rows;
    } catch (error) {
      console.error('Database Fetch Error:', error);
      throw new InternalServerErrorException('Failed to retrieve leads');
    }
  }
}
