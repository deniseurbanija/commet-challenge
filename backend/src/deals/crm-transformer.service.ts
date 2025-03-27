import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import { Deal } from '@prisma/client';

interface RawDealCrmA {
  deal_id?: string;
  opportunity_id?: string;
  total?: number;
  amount?: number;
  salesperson?: string;
  seller?: string;
  rep_name?: string;
  sold_at?: string;
  created_on?: string;
  deal_date?: string;
}

@Injectable()
export class CrmTransformerService {
  private readonly COMMISSION_RATE = 0.1;

  /**
   * Transforms JSON data from CRM A into standardized deal format
   * @param data Raw deal data from CRM A
   * @returns Transformed deals ready for database insertion
   */
  transformJSON(
    data: RawDealCrmA[],
  ): Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>[] {
    return data.map((deal) => ({
      id: deal.deal_id || deal.opportunity_id || '',
      source: 'CRM_A',
      amount: deal.total || deal.amount || 0,
      salesperson: deal.salesperson || deal.seller || deal.rep_name || '',
      date: new Date(deal.sold_at || deal.created_on || Date.now()),
      commission: (deal.total || deal.amount || 0) * this.COMMISSION_RATE,
    }));
  }

  /**
   * Transforms CSV data from CRM B into standardized deal format
   * @param csvString CSV content containing deal data
   * @returns Transformed deals ready for database insertion
   */
  transformCSV(
    csvString: string,
  ): Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>[] {
    const records = parse(csvString, { columns: true });
    return records.map((deal) => ({
      id: deal.opportunity_id,
      source: 'CRM_B',
      amount: parseFloat(deal.amount),
      salesperson: deal.seller,
      date: new Date(deal.deal_date.replace(/\//g, '-')),
      commission: parseFloat(deal.amount) * this.COMMISSION_RATE,
    }));
  }
}
