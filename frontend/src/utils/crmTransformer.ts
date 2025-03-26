import { Deal } from "@/types/deal";
import Papa from "papaparse";

// Función para transformar datos de CRM A (JSON)
export function transformCRMAData(data: any[]): Deal[] {
  return data.map((deal) => ({
    id: deal.deal_id || deal.id,
    amount: deal.total || deal.amount,
    salesperson: deal.rep_name,
    date: deal.sold_at || deal.created_on,
    commission: (deal.total || deal.amount) * 0.1,
  }));
}

// Función para transformar datos de CRM B (CSV)
export const transformCRMBData = (csvString: string): Deal[] => {
  const parsedData = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true,
  });

  return parsedData.data.map((row: any) => ({
    id: row.opportunity_id,
    amount: Number(row.amount),
    salesperson: row.seller,
    date: new Date(row.deal_date.replace(/\//g, "-")).toISOString(),
    commission: parseFloat(row.amount) * 0.1,
  }));
};

// Función principal de transformación
export function transformCRMData(crmAData: any[], crmBData: string): Deal[] {
  const transformedCRMA = transformCRMAData(crmAData);
  const transformedCRMB = transformCRMBData(crmBData);

  return [...transformedCRMA, ...transformedCRMB];
}
