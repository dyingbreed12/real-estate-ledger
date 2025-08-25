"use client";
import { useState, useMemo } from "react";

type Commission = {
  name: string;
  value: number;
  type: "Fixed" | "Percentage";
};

type Employee = {
  id: number;
  name: string;
  commissions: Commission[];
};

type CrystalBallProps = {
  employees?: Employee[];
  ownershipType?: "Direct" | "JV Split";
  ownershipPercentage?: number;
};

export default function CrystalBall({
  employees = [],
  ownershipType = "Direct",
  ownershipPercentage = 50,
}: CrystalBallProps) {
  const [projectedFee, setProjectedFee] = useState(20000);

  // Calculate projected commissions per employee
  const projectedCommissions = useMemo(() => {
    return employees.map(emp => {
      const amounts = emp.commissions.map(c =>
        c.type === "Fixed" ? c.value : (projectedFee * c.value) / 100
      );
      return {
        employee: emp.name,
        total: amounts.reduce((sum, val) => sum + val, 0),
      };
    });
  }, [employees, projectedFee]);

  const totalCommission = projectedCommissions.reduce((sum, emp) => sum + emp.total, 0);

  const netProfit = useMemo(() => {
    const ownershipMultiplier = ownershipType === "Direct" ? 1 : ownershipPercentage / 100;
    return projectedFee * ownershipMultiplier - totalCommission;
  }, [projectedFee, totalCommission, ownershipType, ownershipPercentage]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-6">
      <h2 className="text-lg font-semibold">Crystal Ball - Projected Income</h2>

      {/* Projected Assignment Fee */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Projected Assignment Fee:</label>
        <input
          type="number"
          value={projectedFee}
          onChange={(e) => setProjectedFee(Number(e.target.value))}
          className="border p-2 rounded-md w-full"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 p-4 rounded-md text-center">
          <div className="text-sm text-gray-600">Total Projected Commissions</div>
          <div className="text-lg font-bold">${totalCommission.toLocaleString()}</div>
        </div>
        <div className="bg-gray-100 p-4 rounded-md text-center">
          <div className="text-sm text-gray-600">Projected Net Profit</div>
          <div className="text-lg font-bold">${netProfit.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
