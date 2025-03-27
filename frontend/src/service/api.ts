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

  async importJson(data: any[]) {
    // Send the data to the API
    const response = await fetch(`${API_URL}/import/crm-a`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      throw new Error(
        errorData.message ||
          `Failed to import CRM A data: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  },

  async importCSV(csvFile: any) {
    const formData = new FormData();
    formData.append("file", csvFile);

    const response = await fetch(`${API_URL}/import/crm-b`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      throw new Error(
        errorData.message ||
          `Failed to import CRM B data: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  },
};
