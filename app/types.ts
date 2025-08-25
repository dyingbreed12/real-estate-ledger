// /app/types.ts
export type Commission = {
  name: string;
  value: number;
  type: "Direct" | "JV Split"; // consistent across all components
};

export type Employee = {
  id: number;
  name: string;
  commissions: Commission[];
};
