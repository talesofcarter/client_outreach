import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

  async getLeadById(id: string): Promise<LeadRow> {
    try {
      const query = `SELECT * FROM leads WHERE id = $1;`;
      const result = await this.db.query<LeadRow>(query, [id]);

      if (result.rows.length === 0) {
        throw new NotFoundException('Lead not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Database Fetch Error:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to retrieve the lead');
    }
  }

  async updateLead(
    id: string,
    data: Partial<CreateLeadDto> & { status?: string },
  ): Promise<LeadRow> {
    try {
      // Using COALESCE allows us to only update fields that were actually provided in the request
      const query = `
        UPDATE leads 
        SET 
          business_name = COALESCE($1, business_name),
          city_region = COALESCE($2, city_region),
          category = COALESCE($3, category),
          website_url = COALESCE($4, website_url),
          email = COALESCE($5, email),
          phone = COALESCE($6, phone),
          key_issues_found = COALESCE($7, key_issues_found),
          status = COALESCE($8, status),
          updated_at = NOW()
        WHERE id = $9
        RETURNING *;
      `;

      const values = [
        data.businessName ?? null,
        data.region ?? null,
        data.category ?? null,
        data.website ?? null,
        data.email ?? null,
        data.phone ?? null,
        data.issues ?? null,
        data.status ?? null,
        id,
      ];

      const result = await this.db.query<LeadRow>(query, values);

      if (result.rows.length === 0) {
        throw new NotFoundException('Lead not found');
      }
      return result.rows[0];
    } catch (error) {
      console.error('Database Update Error:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update the lead');
    }
  }

  async deleteLead(id: string): Promise<{ message: string }> {
    try {
      const query = `DELETE FROM leads WHERE id = $1 RETURNING id;`;
      const result = await this.db.query(query, [id]);

      if (result.rows.length === 0) {
        throw new NotFoundException('Lead not found');
      }
      return { message: 'Lead successfully deleted' };
    } catch (error) {
      console.error('Database Delete Error:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete the lead');
    }
  }
}
