import { Deal } from "@/types/deal";

export const parseJson = (data: any[]): Deal[] => {
  return data.map((deal) => ({
    id: deal.deal_id,
    amount: deal.total || deal.amount, // Manejar ambas claves
    salesperson: deal.rep_name,
    date: new Date(deal.sold_at || deal.created_on).toISOString(),
  }));
};
