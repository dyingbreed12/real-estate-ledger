"use client";
import { useMemo, useState } from "react";
import type { Employee } from "@/app/types";

type CalculatorProps = {
  employees?: Employee[];
  assignmentFee: number;
  setAssignmentFee: React.Dispatch<React.SetStateAction<number>>;
  ownershipType: "Direct" | "JV Split";
  setOwnershipType: React.Dispatch<React.SetStateAction<"Direct" | "JV Split">>;
  ownershipPercentage: number;
  setOwnershipPercentage: React.Dispatch<React.SetStateAction<number>>;
};

export default function Calculator({
  employees = [],
  assignmentFee,
  setAssignmentFee,
  ownershipType,
  setOwnershipType,
  ownershipPercentage,
  setOwnershipPercentage,
}: CalculatorProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>(
    employees.length > 0 ? employees[0].id : 0
  );

  const [plMode, setPlMode] = useState<"Assignment" | "Novation">("Assignment");

  const selectedEmployee = employees.find((emp) => emp.id === selectedEmployeeId);

  // Calculate commission amounts
  const commissionAmounts = useMemo(() => {
    if (!selectedEmployee) return [];
    return selectedEmployee.commissions.map((c) => {
      let amount = c.type === "Direct" ? c.value : (assignmentFee * c.value) / 100;

      if (plMode === "Novation") {
        amount *= 0.9; // Example Novation logic
      }

      return amount;
    });
  }, [selectedEmployee, assignmentFee, plMode]);

  const totalCommission = useMemo(() => {
    return commissionAmounts.reduce((sum, val) => sum + val, 0);
  }, [commissionAmounts]);

  const netProfit = useMemo(() => {
    const ownershipMultiplier = ownershipType === "Direct" ? 1 : ownershipPercentage / 100;
    let baseProfit = assignmentFee * ownershipMultiplier - totalCommission;

    if (plMode === "Novation") {
      baseProfit *= 0.95; // Example Novation adjustment
    }

    return baseProfit;
  }, [assignmentFee, totalCommission, ownershipType, ownershipPercentage, plMode]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-6">
      <h2 className="text-lg font-semibold">Calculator</h2>

      {/* P&L Mode Toggle */}
      <div className="flex space-x-4 mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="plMode"
            value="Assignment"
            checked={plMode === "Assignment"}
            onChange={() => setPlMode("Assignment")}
          />
          <span>Assignment P&L</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="plMode"
            value="Novation"
            checked={plMode === "Novation"}
            onChange={() => setPlMode("Novation")}
          />
          <span>Novation P&L</span>
        </label>
      </div>

      {/* Assignment Fee and Ownership */}
      <div className="flex space-x-4">
        <input
          type="number"
          value={assignmentFee}
          onChange={(e) => setAssignmentFee(Number(e.target.value))}
          className="border p-2 rounded-md flex-1"
          placeholder="Assignment Fee"
        />

        <select
          value={ownershipType}
          onChange={(e) => setOwnershipType(e.target.value as "Direct" | "JV Split")}
          className="border p-2 rounded-md flex-1"
        >
          <option value="Direct">Direct</option>
          <option value="JV Split">JV Split</option>
        </select>

        {ownershipType === "JV Split" && (
          <select
            value={ownershipPercentage}
            onChange={(e) => setOwnershipPercentage(Number(e.target.value))}
            className="border p-2 rounded-md w-20"
          >
            {Array.from({ length: 9 }, (_, i) => (i + 1) * 10).map((val) => (
              <option key={val} value={val}>
                {val}%
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Employee Selection */}
      {employees.length > 0 && (
        <div>
          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(Number(e.target.value))}
            className="border p-2 rounded-md w-full mb-2"
          >
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>

          <div className="text-sm text-gray-700 mb-4">
            Total Commissions: ${totalCommission.toLocaleString()}
          </div>
        </div>
      )}

      {/* Net Profit */}
      <div className="text-lg font-medium mt-4">
        Net Profit: ${netProfit.toLocaleString()}
      </div>
    </div>
  );
}
