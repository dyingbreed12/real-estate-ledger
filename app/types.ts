// The Commission type now includes salary, commission, and role in a single record.
export type Commission = {
  name: string; // This is the 'Role'
  salaryValue: number;
  commissionValue: number;
};

// This type remains unchanged
export type OwnershipType = "Direct" | "JV Split";

// The Employee type now has a commissions array with the updated Commission type.
export type Employee = {
  id: number;
  name: string;
  commissions: Commission[];
};