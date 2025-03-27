import { Deal } from "@/types/deal";

const API_URL = "http://localhost:3001/deals";

export const api = {
  async getDeals(): Promise<Deal[]> {
    const response = await fetch(`${API_URL}`);
    if (!response.ok) {
      throw new Error("Error fetching deals");
    }
    return response.json();
  },

  async getTotalCommissions(): Promise<number> {
    const response = await fetch(`${API_URL}/total-commissions`);
    if (!response.ok) {
      throw new Error("Error fetching total commissions");
    }
    const data = await response.json();
    return data.totalCommissions;
  },
};
