"use client";
import { useMemo, useState, useEffect } from "react";
import type { Employee, OwnershipType } from "@/app/types";

type CalculatorProps = {
  employees?: Employee[];
  assignmentFee: number;
  setAssignmentFee: React.Dispatch<React.SetStateAction<number>>;
  ownershipType: OwnershipType;
  ownershipPercentage: number;
  setNetProfit: React.Dispatch<React.SetStateAction<number>>;
  setNetProfitMargin: React.Dispatch<React.SetStateAction<number>>;
};

export default function Calculator({
  employees = [],
  assignmentFee,
  setAssignmentFee,
  ownershipType,
  ownershipPercentage,
  setNetProfit,
  setNetProfitMargin,
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

  // Ensure the selected employee is up-to-date with the latest employees data
  useEffect(() => {
    if (employees.length > 0 && !employees.some(emp => emp.id === selectedEmployeeId)) {
      setSelectedEmployeeId(employees[0].id);
    }
  }, [employees, selectedEmployeeId]);

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

  // Use a single variable for the total fee based on the selected mode
  const totalAssignmentFee = useMemo(() => {
    return plMode === "Assignment" ? assignmentFee : totalAssignmentFeeNovation;
  }, [plMode, assignmentFee, totalAssignmentFeeNovation]);

  const yourAssignmentFee = useMemo(() => {
    if (ownershipType === "JV Split") {
      return totalAssignmentFee * (ownershipPercentage / 100);
    }
    return totalAssignmentFee;
  }, [totalAssignmentFee, ownershipType, ownershipPercentage]);

  const totalCommission = useMemo(() => {
    if (!selectedEmployee) return 0;
    
    return selectedEmployee.commissions.reduce((total, c) => {
      const calculatedAmount = c.salaryValue > 0
        ? c.salaryValue
        : (yourAssignmentFee * c.commissionValue) / 100;
      return total + calculatedAmount;
    }, 0);
  }, [selectedEmployee, yourAssignmentFee, employees]);

  // This useEffect hook handles the dynamic update for both modes, using only totalAssignmentFee
  useEffect(() => {
    setExpenses(prevExpenses => {
      const newExpenses = { ...prevExpenses };
      const baseFee = totalAssignmentFee; // Use the single, consistent variable

      if (baseFee > 0) {
        newExpenses.leadGen.amount = (baseFee * newExpenses.leadGen.percentage) / 100;
        newExpenses.software.amount = (baseFee * newExpenses.software.percentage) / 100;
        newExpenses.other.amount = (baseFee * newExpenses.other.percentage) / 100;
      }
      return newExpenses;
    });
  }, [totalAssignmentFee]);

  const totalExpenses = useMemo(() => {
    // Correctly calculate total expenses by summing up the amounts from the state
    return expenses.leadGen.amount + expenses.software.amount + expenses.other.amount;
  }, [expenses]);

  const grossProfit = useMemo(() => {
    return yourAssignmentFee - totalCommission;
  }, [yourAssignmentFee, totalCommission]);

  const grossProfitPercentage = useMemo(() => {
    return Math.round(totalAssignmentFee > 0 ? (grossProfit / totalAssignmentFee) * 100 : 0);
  }, [grossProfit, totalAssignmentFee]);

  const netProfit = useMemo(() => {
    const baseProfit = grossProfit - totalExpenses;
    return Math.round(baseProfit);
  }, [grossProfit, totalExpenses]);
  
  const totalExpensesPercentage = useMemo(() => {
    // Recalculate the total percentage based on the final total expenses amount
    return totalAssignmentFee > 0 ? (totalExpenses / totalAssignmentFee) * 100 : 0;
  }, [totalExpenses, totalAssignmentFee]);
  
  const netProfitMargin = useMemo(() => {
    return grossProfitPercentage - totalExpensesPercentage;
  }, [grossProfitPercentage, totalExpensesPercentage]);

  useEffect(() => {
    setNetProfit(netProfit);
    setNetProfitMargin(netProfitMargin);
  }, [netProfit, netProfitMargin, setNetProfit, setNetProfitMargin]);

  // handleExpenseChange is a separate handler for direct user input
  const handleExpenseChange = (expenseKey: keyof typeof expenses, field: 'amount' | 'percentage', value: number) => {
    setExpenses(prev => {
      const newExpenses = { ...prev };
      
      if (field === 'amount') {
        newExpenses[expenseKey] = {
          amount: value,
          percentage: totalAssignmentFee > 0 ? (value / totalAssignmentFee) * 100 : 0
        };
      } else { // field === 'percentage'
        newExpenses[expenseKey] = {
          amount: (totalAssignmentFee * value) / 100,
          percentage: value
        };
      }
      return newExpenses;
    });
  };
  
  const totalCommissionPercentage = useMemo(() => {
    return yourAssignmentFee > 0 ? (totalCommission / yourAssignmentFee) * 100 : 0;
  }, [totalCommission, yourAssignmentFee]);

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

      {/* New section to display total employee commission */}
      <h3 className="text-md font-semibold text-gray-700 pt-4">Total Commission</h3>
      <div className="flex items-center space-x-2">
        <label className="text-gray-500 w-2/5">Total Commission Amount:</label>
        <span className="p-2 flex-1 rounded-md bg-gray-100 text-gray-700">
          ${totalCommission.toLocaleString()}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <label className="text-gray-500 w-2/5">Total Commission Margin:</label>
        <span className="p-2 flex-1 rounded-md bg-gray-100 text-gray-700">
          {totalCommissionPercentage.toFixed(2)}%
        </span>
      </div>

      <h3 className="text-md font-semibold text-gray-700 pt-4">Gross Profit</h3>
      <div className="flex items-center space-x-2">
        <label className="text-gray-500 w-2/5">Gross Profit Amount:</label>
        <span className="p-2 flex-1 rounded-md bg-gray-100 text-gray-700">
          ${grossProfit.toLocaleString()}
        </span>
        </div>
      <div className="flex items-center space-x-2">
        <label className="text-gray-500 w-2/5">Gross Profit Margin:</label>
        <span className="p-2 flex-1 rounded-md bg-gray-100 text-gray-700">
          {grossProfitPercentage.toFixed(2)}%
        </span>
      </div>

      <h3 className="text-md font-semibold text-gray-700 pt-4">Expenses</h3>
      <div className="space-y-2">
        {["leadGen", "software", "other"].map((expenseKey) => {
          const expenseData = expenses[expenseKey as keyof typeof expenses];
          
          return (
            <div key={expenseKey} className="flex items-center space-x-2">
              <label className="text-gray-500 capitalize w-2/5">{expenseKey.replace("Gen", " Generation")}:</label>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={expenseData.amount || ''}
                  onChange={(e) => handleExpenseChange(expenseKey as keyof typeof expenses, 'amount', Number(e.target.value))}
                  className="border p-2 pl-6 rounded-md w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Amount"
                />
              </div>
              <div className="relative flex-1">
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                <input
                  type="number"
                  value={expenseData.percentage || ''}
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