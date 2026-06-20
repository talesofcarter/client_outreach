export type LeadStatus =
  | "not_contacted"
  | "contacted"
  | "follow_up_scheduled"
  | "negotiating"
  | "won"
  | "lost";

export interface Lead {
  id: string;
  business_name: string;
  city_region: string;
  website_url: string | null;
  email: string | null;
  phone: string | null;
  key_issues_found: string;
  status: LeadStatus;
  category: string;
  created_at: string;
  updated_at: string;
}
