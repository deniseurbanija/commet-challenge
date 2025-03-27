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
   * Utility method to find the first valid value from a list of possible keys
   * @param data Source object to search
   * @param possibleKeys Array of possible keys to check
   * @returns First non-empty, non-undefined value or undefined
   */
  private findValue(
    data: Record<string, any>,
    possibleKeys: string[],
  ): any | undefined {
    for (const key of possibleKeys) {
      const value = data[key];
      if (value !== undefined && value !== null && value !== '') {
        return value;
      }
    }
    return undefined;
  }

  /**
   * Utility method to parse and normalize amount values
   * @param value Raw amount value
   * @returns Parsed number or 0
   */
  private parseAmount(value: any): number {
    if (value === undefined) return 0;

    const cleanedValue = String(value).replace(/[^0-9.-]+/g, '');
    const parsedAmount = parseFloat(cleanedValue);

    return isNaN(parsedAmount) ? 0 : parsedAmount;
  }

  /**
   * Utility method to parse and normalize date values
   * @param value Raw date value
   * @returns Parsed Date object
   */
  private parseDate(value: any): Date {
    if (!value) return new Date();

    let parsedDate: Date;
    const dateStr = String(value);

    try {
      // Primary parsing attempt
      parsedDate = new Date(dateStr.replace(/\//g, '-'));

      // If primary parsing fails, try alternative strategies
      if (isNaN(parsedDate.getTime())) {
        const alternativeFormats = [
          () => new Date(Date.parse(dateStr)),
          () => {
            const parts = dateStr.split(/[-./]/);
            return new Date(
              parts.length > 2
                ? `${parts[2]}-${parts[1]}-${parts[0]}`
                : dateStr,
            );
          },
        ];

        for (const parseAttempt of alternativeFormats) {
          try {
            parsedDate = parseAttempt();
            if (!isNaN(parsedDate.getTime())) break;
          } catch {}
        }
      }

      // Final fallback
      if (isNaN(parsedDate.getTime())) {
        parsedDate = new Date();
      }
    } catch {
      parsedDate = new Date();
    }

    return parsedDate;
  }

  /**
   * Mapping configurations for different input types
   */
  private readonly keyMappings = {
    id: ['deal_id', 'opportunity_id', 'id', 'Deal ID', 'Opportunity ID'],
    amount: ['total', 'amount', 'sale_amount', 'deal_amount', 'deal amount'],
    salesperson: [
      'salesperson',
      'seller',
      'rep_name',
      'sales_rep',
      'representative',
    ],
    date: [
      'sold_at',
      'created_on',
      'deal_date',
      'sale_date',
      'transaction_date',
    ],
  };

  /**
   * Transforms JSON data from CRM A into standardized deal format
   * @param data Raw deal data from CRM A
   * @returns Transformed deals ready for database insertion
   */
  transformJSON(
    data: RawDealCrmA[],
  ): Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>[] {
    return data.map((rawDeal) => {
      const id = this.findValue(rawDeal, this.keyMappings.id) || 'Unknown Deal';
      const amount = this.parseAmount(
        this.findValue(rawDeal, this.keyMappings.amount),
      );
      const salesperson =
        this.findValue(rawDeal, this.keyMappings.salesperson) ||
        'Unknown Seller';
      const date = this.parseDate(
        this.findValue(rawDeal, this.keyMappings.date),
      );

      return {
        amount,
        salesperson,
        date,
        commission: amount * this.COMMISSION_RATE,
      };
    });
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

    return records.map((record) => {
      // Find the first matching column for each key
      const findColumn = (possibleColumns: string[]) => {
        const foundColumn = possibleColumns.find(
          (col) =>
            record.hasOwnProperty(col) &&
            record[col] !== undefined &&
            record[col] !== '',
        );
        return foundColumn ? record[foundColumn] : undefined;
      };

      const id = findColumn(this.keyMappings.id) || 'Unknown Deal';
      const amount = this.parseAmount(findColumn(this.keyMappings.amount));
      const salesperson =
        findColumn(this.keyMappings.salesperson) || 'Unknown Seller';
      const date = this.parseDate(findColumn(this.keyMappings.date));

      return {
        amount,
        salesperson,
        date,
        commission: amount * this.COMMISSION_RATE,
      };
    });
  }
}
