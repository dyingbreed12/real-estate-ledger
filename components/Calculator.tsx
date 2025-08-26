"use client";
import { useMemo, useState, useEffect } from "react";
import type { Employee, OwnershipType } from "@/app/types";

type CalculatorProps = {
  employees?: Employee[];
  assignmentFee: number;
  setAssignmentFee: React.Dispatch<React.SetStateAction<number>>;
  ownershipType: OwnershipType;
  ownershipPercentage: number;
  onCalculate: (netProfit: number, netProfitMargin: number) => void;
};

export default function Calculator({
  employees = [],
  assignmentFee,
  setAssignmentFee,
  ownershipType,
  ownershipPercentage,
  onCalculate,
}: CalculatorProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    employees.length > 0 ? employees[0].id : null
  );
  const [plMode, setPlMode] = useState<"Assignment" | "Novation">("Assignment");
  
  const [expenses, setExpenses] = useState({
    leadGen: { amount: 0, percentage: 0 },
    software: { amount: 0, percentage: 0 },
    other: { amount: 0, percentage: 0 },
  });

  const [novationState, setNovationState] = useState({
    soldPrice: 0,
    contractedPrice: 0,
    buyerAgentPercentage: 3,
    listingAgentPercentage: 3,
    closingCostsPercentage: 2,
  });

  const selectedEmployee = employees.find((emp) => emp.id === selectedEmployeeId);

  // Novation-specific calculations
  const totalRevenue = useMemo(() => {
    return novationState.soldPrice - novationState.contractedPrice;
  }, [novationState.soldPrice, novationState.contractedPrice]);

  const buyerAgentAmount = useMemo(() => {
    return (novationState.buyerAgentPercentage / 100) * novationState.soldPrice;
  }, [novationState.buyerAgentPercentage, novationState.soldPrice]);

  const listingAgentAmount = useMemo(() => {
    return (novationState.listingAgentPercentage / 100) * novationState.soldPrice;
  }, [novationState.listingAgentPercentage, novationState.soldPrice]);

  const closingCostsAmount = useMemo(() => {
    return (novationState.closingCostsPercentage / 100) * novationState.soldPrice;
  }, [novationState.closingCostsPercentage, novationState.soldPrice]);

  const totalAssignmentFeeNovation = useMemo(() => {
    return totalRevenue - (buyerAgentAmount + listingAgentAmount + closingCostsAmount);
  }, [totalRevenue, buyerAgentAmount, listingAgentAmount, closingCostsAmount]);

  const yourAssignmentFee = useMemo(() => {
    const totalFee = plMode === "Assignment" ? assignmentFee : totalAssignmentFeeNovation;
    if (ownershipType === "JV Split") {
      return totalFee * (ownershipPercentage / 100);
    }
    return totalFee;
  }, [assignmentFee, ownershipType, ownershipPercentage, plMode, totalAssignmentFeeNovation]);

  const totalCommission = useMemo(() => {
    if (!selectedEmployee) return 0;
    
    return selectedEmployee.commissions.reduce((total, c) => {
      const calculatedAmount = c.salaryValue > 0 
        ? c.salaryValue 
        : (yourAssignmentFee * c.commissionValue) / 100;
      return total + calculatedAmount;
    }, 0);
  }, [selectedEmployee, yourAssignmentFee]);

  const totalExpenses = useMemo(() => {
    const baseFee = plMode === "Assignment" ? assignmentFee : totalAssignmentFeeNovation;
    const leadGenAmount = expenses.leadGen.percentage > 0 ? (baseFee * expenses.leadGen.percentage) / 100 : expenses.leadGen.amount;
    const softwareAmount = expenses.software.percentage > 0 ? (baseFee * expenses.software.percentage) / 100 : expenses.software.amount;
    const otherAmount = expenses.other.percentage > 0 ? (baseFee * expenses.other.percentage) / 100 : expenses.other.amount;
    
    return leadGenAmount + softwareAmount + otherAmount;
  }, [assignmentFee, totalAssignmentFeeNovation, expenses, plMode]);

  const grossProfit = useMemo(() => {
    return yourAssignmentFee - totalCommission;
  }, [yourAssignmentFee, totalCommission]);

  const grossProfitPercentage = useMemo(() => {
    const baseFee = plMode === "Assignment" ? assignmentFee : totalAssignmentFeeNovation;
    return Math.round(baseFee > 0 ? (grossProfit / baseFee) * 100 : 0);
  }, [grossProfit, assignmentFee, totalAssignmentFeeNovation, plMode]);

  const netProfit = useMemo(() => {
    let baseProfit = grossProfit - totalExpenses;

    if (plMode === "Novation") {
        return baseProfit
    }

    return baseProfit;
  }, [grossProfit, totalExpenses, plMode]);

  const totalExpensesPercentage = useMemo(() => {
    // The spreadsheet only shows a percentage for Lead Generation in the expenses section.
    // The Net Profit percentage is derived from Gross Profit % minus Lead Gen %.
    return expenses.leadGen.percentage;
  }, [expenses]);
  
  const netProfitMargin = useMemo(() => {
    return grossProfitPercentage - totalExpensesPercentage;
  }, [grossProfitPercentage, totalExpensesPercentage]);

  useEffect(() => {
    onCalculate(netProfit, netProfitMargin);
  }, [netProfit, netProfitMargin, onCalculate]);

  const handleExpenseChange = (expenseKey: keyof typeof expenses, field: 'amount' | 'percentage', value: number) => {
    setExpenses(prev => ({
      ...prev,
      [expenseKey]: {
        ...prev[expenseKey],
        [field]: value,
        [field === 'amount' ? 'percentage' : 'amount']: 0
      }
    }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-6">
      <h2 className="text-lg font-semibold">Profit Calculator</h2>

      <div className="p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
        <div className="flex text-sm">
          <button
            onClick={() => setPlMode("Assignment")}
            className={`w-1/2 py-2 font-medium rounded-md transition-colors ${
              plMode === "Assignment"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Assignment
          </button>
          <button
            onClick={() => setPlMode("Novation")}
            className={`w-1/2 py-2 font-medium rounded-md transition-colors ${
              plMode === "Novation"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Novation
          </button>
        </div>
      </div>

      {plMode === "Assignment" ? (
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-700">Assignment Fees</h3>
          <div className="flex items-center space-x-2">
            <label className="text-gray-500 w-2/5">Total Assignment Fee:</label>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={assignmentFee}
                onChange={(e) => setAssignmentFee(Number(e.target.value))}
                className="border p-2 pl-6 rounded-md w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter total fee"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-gray-500 w-2/5">Your Assignment Fee:</label>
            <span className="p-2 flex-1 rounded-md bg-gray-100 text-gray-700">
              ${yourAssignmentFee.toLocaleString()}
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-700">Novation Fees</h3>
          <div className="flex items-center space-x-2">
            <label className="text-gray-500 w-2/5">Sold Price:</label>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={novationState.soldPrice}
                onChange={(e) => setNovationState({...novationState, soldPrice: Number(e.target.value)})}
                className="border p-2 pl-6 rounded-md w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-gray-500 w-2/5">Contracted Price:</label>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={novationState.contractedPrice}
                onChange={(e) => setNovationState({...novationState, contractedPrice: Number(e.target.value)})}
                className="border p-2 pl-6 rounded-md w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-gray-500 w-2/5">Total Revenue:</label>
            <span className="p-2 flex-1 rounded-md bg-gray-100 text-gray-700">
              ${totalRevenue.toLocaleString()}
            </span>
          </div>
          
          <h3 className="text-md font-semibold text-gray-700 pt-4">Commissions & Costs</h3>
          <div className="space-y-2">
            {[{ label: "Buyer Agent", key: "buyerAgentPercentage", amount: buyerAgentAmount },
             { label: "Listing Agent", key: "listingAgentPercentage", amount: listingAgentAmount },
             { label: "Closing Costs", key: "closingCostsPercentage", amount: closingCostsAmount }]
             .map((item) => (
              <div key={item.key} className="flex items-center space-x-2">
                <label className="text-gray-500 w-2/5">{item.label}:</label>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="text"
                    value={item.amount.toLocaleString()}
                    readOnly
                    className="border p-2 pl-6 rounded-md w-full bg-gray-100 text-gray-700 focus:outline-none"
                  />
                </div>
                <div className="relative flex-1">
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                  <input
                    type="number"
                    value={novationState[item.key as keyof typeof novationState] || ''}
                    onChange={(e) => setNovationState({...novationState, [item.key]: Number(e.target.value)})}
                    className="border p-2 pr-6 rounded-md w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-gray-500 w-2/5">Total Assignment Fee:</label>
            <span className="p-2 flex-1 rounded-md bg-gray-100 text-gray-700">
              ${totalAssignmentFeeNovation.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-gray-500 w-2/5">Your Assignment Fee:</label>
            <span className="p-2 flex-1 rounded-md bg-gray-100 text-gray-700">
              ${yourAssignmentFee.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <h3 className="text-md font-semibold text-gray-700 pt-4">Commissions</h3>
      {employees.length > 0 && (
        <div>
          <label className="block mb-1 font-medium">Select Employee:</label>
          <select
            value={selectedEmployeeId || ''}
            onChange={(e) => setSelectedEmployeeId(Number(e.target.value))}
            className="border p-2 rounded-md w-full mb-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>

          {selectedEmployee != null && selectedEmployee?.commissions?.length > 0 ? (
            <div className="text-sm text-gray-700 space-y-2">
              <div className="grid grid-cols-3 gap-2 font-semibold text-gray-600 border-b pb-1 mb-2">
                  <span>Name</span>
                  <span>Amount</span>
                  <span>Commission</span>
              </div>
              {selectedEmployee.commissions.map((c, index) => {
                const displayAmount = c.salaryValue > 0
                  ? c.salaryValue
                  : (yourAssignmentFee * c.commissionValue) / 100;
                
                const displayPercentage = c.commissionValue > 0
                  ? c.commissionValue
                  : (c.salaryValue / yourAssignmentFee) * 100;

                return (
                  <div key={index} className="grid grid-cols-3 gap-2 items-center">
                    <span className="font-medium">{c.name}</span>
                    <span>${displayAmount.toLocaleString()}</span>
                    <span>{displayPercentage.toFixed(2)}%</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No commissions added for this employee.</p>
          )}
        </div>
      )}

      <h3 className="text-md font-semibold text-gray-700 pt-4">Gross Profit</h3>
      <div className="flex items-center space-x-2">
        <label className="text-gray-500 w-2/5">Gross Profit Amount:</label>
        <span className="p-2 flex-1 rounded-md bg-gray-100 text-gray-700">
          ${grossProfit.toLocaleString()}
        </span>
        </div>
      <div className="flex items-center space-x-2">
        <label className="text-gray-500 w-2/5">Gross Profit Percentage:</label>
        <span className="p-2 flex-1 rounded-md bg-gray-100 text-gray-700">
          {grossProfitPercentage.toFixed(2)}%
        </span>
      </div>

      <h3 className="text-md font-semibold text-gray-700 pt-4">Expenses</h3>
      <div className="space-y-2">
        {["leadGen", "software", "other"].map((expenseKey) => {
          const baseFee = plMode === "Assignment" ? assignmentFee : totalAssignmentFeeNovation;
          const displayAmount = expenses[expenseKey as keyof typeof expenses].percentage > 0
            ? (baseFee * expenses[expenseKey as keyof typeof expenses].percentage) / 100
            : expenses[expenseKey as keyof typeof expenses].amount;
          return (
            <div key={expenseKey} className="flex items-center space-x-2">
              <label className="text-gray-500 capitalize w-2/5">{expenseKey.replace("Gen", " Generation")}:</label>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={displayAmount || ''}
                  onChange={(e) => handleExpenseChange(expenseKey as keyof typeof expenses, 'amount', Number(e.target.value))}
                  className="border p-2 pl-6 rounded-md w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Amount"
                />
              </div>
              <div className="relative flex-1">
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                <input
                  type="number"
                  value={expenses[expenseKey as keyof typeof expenses].percentage || ''}
                  onChange={(e) => handleExpenseChange(expenseKey as keyof typeof expenses, 'percentage', Number(e.target.value))}
                  className="border p-2 pr-6 rounded-md w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Percentage"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}