import { toast } from "sonner";

// Mapping configurations for flexible field validation
const fieldMappings = {
  crmA: {
    id: [
      "deal_id",
      "opportunity_id",
      "id",
      "Deal ID",
      "Opportunity ID",
      "dealId",
    ],
    amount: [
      "total",
      "amount",
      "sale_amount",
      "deal_amount",
      "Deal Amount",
      "Total",
    ],
    rep: [
      "rep_name",
      "salesperson",
      "seller",
      "sales_rep",
      "representative",
      "Sales Rep",
    ],
    date: [
      "sold_at",
      "created_on",
      "deal_date",
      "sale_date",
      "transaction_date",
      "Deal Date",
    ],
  },
  crmB: {
    id: [
      "opportunity_id",
      "deal_id",
      "id",
      "Deal ID",
      "Opportunity ID",
      "dealId",
    ],
    amount: [
      "amount",
      "total",
      "deal_amount",
      "deal amount",
      "sale_amount",
      "Sale Amount",
    ],
    seller: [
      "seller",
      "salesperson",
      "sales_person",
      "sales person",
      "rep",
      "sales_rep",
      "sales rep",
      "representative",
    ],
    date: [
      "deal_date",
      "deal date",
      "date",
      "sale_date",
      "sale date",
      "transaction_date",
      "transaction date",
    ],
  },
};

/**
 * Flexibly find a value in an object using multiple possible keys
 * @param item The object to search
 * @param possibleKeys Array of possible keys to check
 * @returns The first non-empty value or undefined
 */
const findFlexibleValue = (
  item: Record<string, any>,
  possibleKeys: string[]
): any | undefined => {
  for (const key of possibleKeys) {
    const value = item[key];
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
  return undefined;
};

/**
 * Validate CRM A data with flexible field detection
 * @param data Array of data to validate
 * @returns Boolean indicating if data is valid
 */
export const validateCrmAData = (data: any[]): boolean => {
  return data.every((item) => {
    // Flexibly check for ID
    const id = findFlexibleValue(item, fieldMappings.crmA.id);
    if (!id) {
      toast.error("Invalid data format", {
        description: "Each item must have an identifier (deal_id, id, etc.)",
      });
      return false;
    }

    // Flexibly check for amount
    const amount = findFlexibleValue(item, fieldMappings.crmA.amount);
    if (amount === undefined) {
      toast.error("Invalid data format", {
        description: "Each item must have an amount (total, amount, etc.)",
      });
      return false;
    }

    // Flexibly check for representative name
    const rep = findFlexibleValue(item, fieldMappings.crmA.rep);
    if (!rep) {
      toast.error("Invalid data format", {
        description: "Each item must have a representative name",
      });
      return false;
    }

    // Flexibly check for date
    const date = findFlexibleValue(item, fieldMappings.crmA.date);
    if (!date) {
      toast.error("Invalid data format", {
        description: "Each item must have a date (sold_at, created_on, etc.)",
      });
      return false;
    }

    return true;
  });
};

/**
 * Validate CSV data with flexible column detection
 * @param csvContent Raw CSV content
 * @returns Boolean indicating if CSV has required columns
 */
export const validateCsvColumns = (csvContent: string): boolean => {
  // Split the first line to get headers
  const headers = csvContent.split("\n")[0].toLowerCase().split(",");

  // Check for at least one matching column in each required category
  const hasId = headers.some((h) =>
    fieldMappings.crmB.id.some((idCol) => h.includes(idCol.toLowerCase()))
  );
  const hasAmount = headers.some((h) =>
    fieldMappings.crmB.amount.some((amountCol) =>
      h.includes(amountCol.toLowerCase())
    )
  );
  const hasSeller = headers.some((h) =>
    fieldMappings.crmB.seller.some((sellerCol) =>
      h.includes(sellerCol.toLowerCase())
    )
  );
  const hasDate = headers.some((h) =>
    fieldMappings.crmB.date.some((dateCol) => h.includes(dateCol.toLowerCase()))
  );

  if (!hasId) {
    toast.error("Missing Column", {
      description: "CSV must have a column for deal identifier",
    });
    return false;
  }

  if (!hasAmount) {
    toast.error("Missing Column", {
      description: "CSV must have a column for deal amount",
    });
    return false;
  }

  if (!hasSeller) {
    toast.error("Missing Column", {
      description: "CSV must have a column for seller/representative",
    });
    return false;
  }

  if (!hasDate) {
    toast.error("Missing Column", {
      description: "CSV must have a column for deal date",
    });
    return false;
  }

  return true;
};
