"use client";
import { useState, useMemo } from "react";
import Donut from "@/components/charts/Donut";

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

type CalculatorProps = {
  employees?: Employee[];
  ownershipType: "Direct" | "JV Split";
  setOwnershipType: React.Dispatch<React.SetStateAction<"Direct" | "JV Split">>;
  ownershipPercentage: number;
  setOwnershipPercentage: React.Dispatch<React.SetStateAction<number>>;
};

type CalculatorView = "Assignment" | "Novation";

export default function Calculator({
  employees = [],
  ownershipType,
  setOwnershipType,
  ownershipPercentage,
  setOwnershipPercentage,
}: CalculatorProps) {
  const [assignmentFee, setAssignmentFee] = useState(20000);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>(
    employees.length > 0 ? employees[0].id : 0
  );
  const [view, setView] = useState<CalculatorView>("Assignment");

  const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);

  // Calculate commission amounts
  const commissionAmounts = useMemo(() => {
    if (!selectedEmployee) return [];
    return selectedEmployee.commissions.map(c => {
      const amount =
        c.type === "Fixed"
          ? c.value
          : (assignmentFee * c.value) / 100;
      return amount;
    });
  }, [selectedEmployee, assignmentFee]);

  const totalCommission = useMemo(() => {
    return commissionAmounts.reduce((sum, val) => sum + val, 0);
  }, [commissionAmounts]);

  // Calculate net profit differently for Assignment vs Novation
  const netProfit = useMemo(() => {
    if (!selectedEmployee) return 0;
    const ownershipMultiplier = ownershipType === "Direct" ? 1 : ownershipPercentage / 100;

    if (view === "Assignment") {
      // Assignment P&L formula
      return assignmentFee * ownershipMultiplier - totalCommission;
    } else {
      // Novation P&L formula
      // Example: Novation might have 10% fee deduction before ownership
      const novationFee = assignmentFee * 0.1;
      return (assignmentFee - novationFee) * ownershipMultiplier - totalCommission;
    }
  }, [assignmentFee, totalCommission, ownershipType, ownershipPercentage, view]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-6">
      <h2 className="text-lg font-semibold">Calculator</h2>

      {/* Toggle between Assignment and Novation */}
      <div className="flex space-x-2 mb-4">
        <button
          className={`px-4 py-2 rounded-md ${view === "Assignment" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setView("Assignment")}
        >
          Assignment P&L
        </button>
        <button
          className={`px-4 py-2 rounded-md ${view === "Novation" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setView("Novation")}
        >
          Novation P&L
        </button>
      </div>

      {/* Assignment Fee & Ownership Inputs */}
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
          <input
            type="number"
            value={ownershipPercentage}
            onChange={(e) => setOwnershipPercentage(Number(e.target.value))}
            className="border p-2 rounded-md w-20"
          />
        )}
      </div>

      {/* Employee Selection */}
      {employees.length > 0 ? (
        <div>
          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(Number(e.target.value))}
            className="border p-2 rounded-md w-full mb-2"
          >
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>

          <div className="text-sm text-gray-700 mb-4">
            Total Commissions: ${totalCommission.toLocaleString()}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No employees available for calculations.</p>
      )}

      {/* Donut Chart for commissions */}
      {selectedEmployee && selectedEmployee.commissions.length > 0 ? (
        <Donut
          labels={selectedEmployee.commissions.map(c => c.name)}
          data={commissionAmounts}
        />
      ) : (
        <p className="text-gray-500">No commissions to display.</p>
      )}

      {/* Net Profit */}
      <div className="text-lg font-medium mt-4">
        {view} Net Profit: ${netProfit.toLocaleString()}
      </div>
    </div>
  );
}
