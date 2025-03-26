export interface Deal {
  id: string;
  amount: number;
  salesperson: string;
  date: string;
  commission: number;
}

export interface ImportResult {
  success: boolean;
  deals: Deal[];
  errors?: string[];
}
