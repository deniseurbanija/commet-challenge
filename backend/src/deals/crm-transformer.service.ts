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
  sold_at?: string;
  created_on?: string;
  deal_date?: string;
}

@Injectable()
export class CrmTransformerService {
  private readonly COMMISSION_RATE = 0.1;

  transformCrmAData(
    data: RawDealCrmA[],
  ): Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>[] {
    return data.map((deal) => ({
      id: deal.deal_id || deal.opportunity_id || '',
      source: 'CRM_A',
      amount: deal.total || deal.amount || 0,
      salesperson: deal.salesperson || deal.seller || '',
      date: new Date(deal.sold_at || deal.created_on || Date.now()),
      commission: (deal.total || deal.amount || 0) * this.COMMISSION_RATE,
    }));
  }

  // Si necesitas método para CSV de CRM B
  transformCrmBCsvData(
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
