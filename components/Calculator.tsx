"use client";
import { useMemo, useState, useEffect } from "react";
import Select, { StylesConfig, ActionMeta, MultiValue } from 'react-select';
import type { Employee, OwnershipType } from "@/app/types";

// Define a type for the option objects
type EmployeeOption = {
  value: number;
  label: string;
};

// Define the correct type for customStyles
const customStyles: StylesConfig<EmployeeOption, true> = {
  control: (provided) => ({
    ...provided,
    backgroundColor: '#f9fafb', // bg-gray-50
    borderColor: '#d1d5db', // border-gray-300
    '&:hover': {
      borderColor: '#d1d5db',
    },
    boxShadow: 'none',
    minHeight: '44px',
    paddingLeft: '0.5rem',
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#dbeafe', // bg-blue-100
    borderRadius: '0.375rem',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#1e40af', // text-blue-800
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#3b82f6', // text-blue-500
    ':hover': {
      backgroundColor: '#2563eb', // bg-blue-600
      color: 'white',
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    zIndex: 50, // Higher z-index to be on top of other elements
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#eff6ff' : state.isFocused ? '#f3f4f6' : 'white',
    color: '#1f2937', // text-gray-900
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#9ca3af', // text-gray-400
  }),
};

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
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([]);
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
    otherNovationCostsPercentage: 0,
  });

  useEffect(() => {
    if (employees.length > 0 && selectedEmployeeIds.length === 0) {
      setSelectedEmployeeIds([employees[0].id]);
    }
  }, [employees, selectedEmployeeIds]);

  const selectedEmployees = useMemo(() => {
    return employees.filter(emp => selectedEmployeeIds.includes(emp.id));
  }, [employees, selectedEmployeeIds]);

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
  
  const otherNovationCostsAmount = useMemo(() => {
    return (novationState.otherNovationCostsPercentage / 100) * novationState.soldPrice;
  }, [novationState.otherNovationCostsPercentage, novationState.soldPrice]);

  const totalAssignmentFeeNovation = useMemo(() => {
    return totalRevenue - (buyerAgentAmount + listingAgentAmount + closingCostsAmount + otherNovationCostsAmount);
  }, [totalRevenue, buyerAgentAmount, listingAgentAmount, closingCostsAmount, otherNovationCostsAmount]);

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
    return selectedEmployees.reduce((total, employee) => {
      const employeeCommissions = employee.commissions.reduce((empTotal, c) => {
        const calculatedAmount = c.salaryValue > 0
          ? c.salaryValue
          : (yourAssignmentFee * c.commissionValue) / 100;
        return empTotal + calculatedAmount;
      }, 0);
      return total + employeeCommissions;
    }, 0);
  }, [selectedEmployees, yourAssignmentFee]);

  useEffect(() => {
    setExpenses(prevExpenses => {
      const newExpenses = { ...prevExpenses };
      const baseFee = totalAssignmentFee;

      if (baseFee > 0) {
        newExpenses.leadGen.amount = (baseFee * newExpenses.leadGen.percentage) / 100;
        newExpenses.software.amount = (baseFee * newExpenses.software.percentage) / 100;
        newExpenses.other.amount = (baseFee * newExpenses.other.percentage) / 100;
      }
      return newExpenses;
    });
  }, [totalAssignmentFee]);

  const totalExpenses = useMemo(() => {
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
    return totalAssignmentFee > 0 ? (totalExpenses / totalAssignmentFee) * 100 : 0;
  }, [totalExpenses, totalAssignmentFee]);
  
  const netProfitMargin = useMemo(() => {
    return grossProfitPercentage - totalExpensesPercentage;
  }, [grossProfitPercentage, totalExpensesPercentage]);

  useEffect(() => {
    setNetProfit(netProfit);
    setNetProfitMargin(netProfitMargin);
  }, [netProfit, netProfitMargin, setNetProfit, setNetProfitMargin]);

  const handleExpenseChange = (expenseKey: keyof typeof expenses, field: 'amount' | 'percentage', value: number) => {
    setExpenses(prev => {
      const newExpenses = { ...prev };
      
      if (field === 'amount') {
        newExpenses[expenseKey] = {
          amount: value,
          percentage: totalAssignmentFee > 0 ? (value / totalAssignmentFee) * 100 : 0
        };
      } else {
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
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="bg-white p-6 rounded-2xl shadow-xl space-y-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Profit Calculator</h2>

        <div className="p-1 rounded-lg bg-gray-100 flex text-sm">
          <button
            onClick={() => setPlMode("Assignment")}
            className={`flex-1 py-2 font-medium rounded-md transition-colors ${
              plMode === "Assignment"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Assignment
          </button>
          <button
            onClick={() => setPlMode("Novation")}
            className={`flex-1 py-2 font-medium rounded-md transition-colors ${
              plMode === "Novation"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Novation
          </button>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800">{plMode === "Assignment" ? "Assignment Fees" : "Novation Fees"}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {plMode === "Assignment" ? (
              <>
                <div className="flex flex-col space-y-2">
                  <label className="text-gray-600 font-medium">Total Assignment Fee</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={assignmentFee}
                      onChange={(e) => setAssignmentFee(Number(e.target.value))}
                      className="w-full px-4 py-2 pl-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 text-gray-900"
                      placeholder="Enter total fee"
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-gray-600 font-medium">Your Assignment Fee</label>
                  <div className="p-2 pl-8 rounded-md bg-gray-100 text-gray-700 font-semibold relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    {yourAssignmentFee.toLocaleString()}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col space-y-2">
                  <label className="text-gray-600 font-medium">Sold Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={novationState.soldPrice}
                      onChange={(e) => setNovationState({...novationState, soldPrice: Number(e.target.value)})}
                      className="w-full px-4 py-2 pl-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 text-gray-900"
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-gray-600 font-medium">Contracted Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={novationState.contractedPrice}
                      onChange={(e) => setNovationState({...novationState, contractedPrice: Number(e.target.value)})}
                      className="w-full px-4 py-2 pl-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 text-gray-900"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 flex flex-col space-y-2">
                  <label className="text-gray-600 font-medium">Total Revenue</label>
                  <div className="p-2 pl-8 rounded-md bg-gray-100 text-gray-700 font-semibold relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    {totalRevenue.toLocaleString()}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4 pt-4">
                  <h4 className="text-lg font-bold text-gray-700">Commissions & Costs</h4>
                  <div className="space-y-2">
                    {[
                      { label: "Buyer Agent", key: "buyerAgentPercentage", amount: buyerAgentAmount, isPercentage: true },
                      { label: "Listing Agent", key: "listingAgentPercentage", amount: listingAgentAmount, isPercentage: true },
                      { label: "Closing Costs", key: "closingCostsPercentage", amount: closingCostsAmount, isPercentage: true },
                      { label: "Other Novation Costs", key: "otherNovationCostsPercentage", amount: otherNovationCostsAmount, isPercentage: true }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center space-x-2">
                        <label className="text-gray-500 w-2/5">{item.label}:</label>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                          <input
                            type="text"
                            value={item.amount.toLocaleString()}
                            readOnly
                            className="w-full px-4 py-2 pl-8 border border-gray-300 rounded-md bg-gray-100 text-gray-700 font-medium focus:outline-none"
                          />
                        </div>
                        {item.isPercentage && (
                          <div className="relative flex-1">
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                            <input
                              type="number"
                              value={novationState[item.key as keyof typeof novationState] || ''}
                              onChange={(e) => setNovationState({...novationState, [item.key]: Number(e.target.value)})}
                              className="w-full px-4 py-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 text-gray-900"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2 flex flex-col space-y-2">
                  <label className="text-gray-600 font-medium">Total Assignment Fee</label>
                  <div className="p-2 pl-8 rounded-md bg-gray-100 text-gray-700 font-semibold relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    {totalAssignmentFeeNovation.toLocaleString()}
                  </div>
                </div>
                <div className="md:col-span-2 flex flex-col space-y-2">
                  <label className="text-gray-600 font-medium">Your Assignment Fee</label>
                  <div className="p-2 pl-8 rounded-md bg-gray-100 text-gray-700 font-semibold relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    {yourAssignmentFee.toLocaleString()}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800">Commissions</h3>
          {employees.length > 0 && (
            <div>
              <label className="block mb-2 font-medium text-gray-600">Select Employee</label>
              <Select
                isMulti
                options={employees.map(emp => ({ value: emp.id, label: emp.name }))}
                value={employees.filter(emp => selectedEmployeeIds.includes(emp.id)).map(emp => ({ value: emp.id, label: emp.name }))}
                onChange={(selectedOptions: MultiValue<EmployeeOption>) => setSelectedEmployeeIds(selectedOptions.map(option => option.value))}
                styles={customStyles}
              />
              {selectedEmployees.length > 0 ? (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-3 gap-2 font-semibold text-gray-600 border-b pb-2 mb-2">
                    <span>Name</span>
                    <span>Amount</span>
                    <span>Commission</span>
                  </div>
                  {selectedEmployees.map((employee) => (
                    <div key={employee.id} className="space-y-2">
                      <p className="font-bold text-gray-800">{employee.name}</p>
                      {employee.commissions.length > 0 ? (
                        employee.commissions.map((c, index) => {
                          const displayAmount = c.salaryValue > 0
                            ? c.salaryValue
                            : (yourAssignmentFee * c.commissionValue) / 100;
                          
                          const displayPercentage = c.commissionValue > 0
                            ? c.commissionValue
                            : (c.salaryValue / yourAssignmentFee) * 100;
                          
                          return (
                            <div key={`${employee.id}-${c.name}-${index}`} className="grid grid-cols-3 gap-2 items-center pl-4 text-gray-700">
                              <span>{c.name}</span>
                              <span>${displayAmount.toLocaleString()}</span>
                              <span>{displayPercentage.toFixed(2)}%</span>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-gray-500 pl-4">No commissions added.</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-4">No employees selected.</p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800">Total Commission</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="text-gray-600 font-medium">Total Commission Amount</label>
              <div className="p-2 pl-8 rounded-md bg-gray-100 text-gray-700 font-semibold relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                {totalCommission.toLocaleString()}
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-600 font-medium">Total Commission Margin</label>
              <div className="p-2 pl-8 rounded-md bg-gray-100 text-gray-700 font-semibold relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                {totalCommissionPercentage.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800">Gross Profit</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="text-gray-600 font-medium">Gross Profit Amount</label>
              <div className="p-2 pl-8 rounded-md bg-gray-100 text-gray-700 font-semibold relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                {grossProfit.toLocaleString()}
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-gray-600 font-medium">Gross Profit Margin</label>
              <div className="p-2 pl-8 rounded-md bg-gray-100 text-gray-700 font-semibold relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                {grossProfitPercentage.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800">Expenses</h3>
          <div className="space-y-4">
            {["leadGen", "software", "other"].map((expenseKey) => {
              const expenseData = expenses[expenseKey as keyof typeof expenses];
              
              return (
                <div key={expenseKey} className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
                  <label className="capitalize text-gray-600 font-medium w-full md:w-2/5">{expenseKey.replace("Gen", " Generation")}:</label>
                  <div className="relative flex-1 w-full">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      value={expenseData.amount || ''}
                      onChange={(e) => handleExpenseChange(expenseKey as keyof typeof expenses, 'amount', Number(e.target.value))}
                      className="w-full px-4 py-2 pl-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 text-gray-900"
                      placeholder="Amount"
                    />
                  </div>
                  <div className="relative flex-1 w-full">
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                    <input
                      type="number"
                      value={expenseData.percentage || ''}
                      onChange={(e) => handleExpenseChange(expenseKey as keyof typeof expenses, 'percentage', Number(e.target.value))}
                      className="w-full px-4 py-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 text-gray-900"
                      placeholder="Percentage"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}