import Papa from "papaparse";
import { Deal } from "@/types/deal";

export const parseCRMBCSV = (csvString: string): Deal[] => {
  const parsedData = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true,
  });

  return parsedData.data.map((row: any) => ({
    id: row.opportunity_id,
    amount: Number(row.amount),
    salesperson: row.seller,
    date: new Date(row.deal_date.replace(/\//g, "-")).toISOString(), // Formato ISO
  }));
};
