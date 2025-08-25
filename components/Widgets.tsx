"use client";
import type { Employee } from "@/app/types";


type WidgetsProps = {
  employees: Employee[];
  assignmentFee: number;
  ownershipType: "Direct" | "JV Split";
  ownershipPercentage: number;
};

export default function Widgets({
  employees,
  assignmentFee,
  ownershipType,
  ownershipPercentage,
}: WidgetsProps) {
  // Calculate total commissions
  const totalCommissions = employees.reduce((sum, emp) => {
    const empTotal = emp.commissions.reduce((empSum, c) => {
      const val = c.type === "Direct" ? c.value : (assignmentFee * c.value) / 100;
      return empSum + val;
    }, 0);
    return sum + empTotal;
  }, 0);

  // Net Profit
  const ownershipMultiplier = ownershipType === "Direct" ? 1 : ownershipPercentage / 100;
  const netProfit = assignmentFee * ownershipMultiplier - totalCommissions;

  // Profit Margin
  const profitMargin = assignmentFee > 0 ? (netProfit / assignmentFee) * 100 : 0;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-6 rounded-2xl shadow text-center">
        <h3 className="text-gray-500 font-medium">Net Profit</h3>
        <p className="text-2xl font-bold mt-2">${netProfit.toLocaleString()}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow text-center">
        <h3 className="text-gray-500 font-medium">Profit Margin</h3>
        <p className="text-2xl font-bold mt-2">{profitMargin.toFixed(2)}%</p>
      </div>
    </div>
  );
}
