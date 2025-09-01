"use client";
import { useState, useEffect } from "react";
import type { Employee, Commission } from "@/app/types";

type EmployeeListProps = {
  employees?: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
};

export default function EmployeeList({ employees = [], setEmployees }: EmployeeListProps) {
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [commissionInputs, setCommissionInputs] = useState<{
    [key: number]: {
      name: string;
      salaryValue: number;
      commissionValue: number;
    };
  }>({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const commissionOptions = [
    "Acquisition Agent",
    "Disposition Agent",
    "General Manager",
    "Transaction Coordinator",
    "Underwriter",
    "Other",
  ] as const;

  // Initialize commissionInputs state for new employees added via props
  useEffect(() => {
    employees.forEach(emp => {
      if (!commissionInputs[emp.id]) {
        setCommissionInputs(prev => ({
          ...prev,
          [emp.id]: { name: "", salaryValue: 0, commissionValue: 0 }
        }));
      }
    });
  }, [employees, commissionInputs]);

  const addEmployee = () => {
    if (!newEmployeeName.trim()) return;
    setEmployees([
      ...employees,
      { id: Date.now(), name: newEmployeeName, commissions: [] },
    ]);
    setNewEmployeeName("");
  };

  const confirmRemoveEmployee = (emp: Employee) => {
    setEmployeeToDelete(emp);
    setIsModalOpen(true);
  };

  const handleRemoveEmployee = () => {
    if (employeeToDelete) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== employeeToDelete.id));
      setEmployeeToDelete(null);
      setIsModalOpen(false);
    }
  };

  const addCommission = (empId: number) => {
    const input = commissionInputs[empId];
    if (!input?.name || (input.salaryValue <= 0 && input.commissionValue <= 0)) {
      return;
    }

    const newCommissionRecord: Commission = {
      name: input.name,
      salaryValue: input.salaryValue,
      commissionValue: input.commissionValue,
    };

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === empId
          ? { ...emp, commissions: [...emp.commissions, newCommissionRecord] }
          : emp
      )
    );

    setCommissionInputs((prev) => ({
      ...prev,
      [empId]: { name: "", salaryValue: 0, commissionValue: 0 },
    }));
  };

  const removeCommission = (empId: number, commIdx: number) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === empId
          ? {
              ...emp,
              commissions: emp.commissions.filter((_, idx) => idx !== commIdx),
            }
          : emp
      )
    );
  };

  const handleInputChange = (empId: number, field: string, value: number | string) => {
    setCommissionInputs((prev) => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        name: prev[empId]?.name || "",
        salaryValue: prev[empId]?.salaryValue || 0,
        commissionValue: prev[empId]?.commissionValue || 0,
        [field]: value,
      },
    }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4">Employee List</h2>

      <div className="flex mb-4 space-x-2">
        <input
          type="text"
          value={newEmployeeName}
          onChange={(e) => setNewEmployeeName(e.target.value)}
          placeholder="New Employee Name"
          className="border p-2 rounded-md flex-1"
        />
        <button
          onClick={addEmployee}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Employee
        </button>
      </div>

      <div className="space-y-4">
        {employees.length === 0 && (
          <p className="text-gray-500">No employees added yet.</p>
        )}
        {employees.map((emp) => (
          <div key={emp.id} className="border p-3 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-800">{emp.name}</span>
              <button
                onClick={() => confirmRemoveEmployee(emp)}
                className="text-red-600 hover:text-red-800 transition-colors flex items-center space-x-1"
                aria-label={`Remove ${emp.name}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.728-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                </svg>
                <span>Remove</span>
              </button>
            </div>

            <div className="flex space-x-2 mb-2 items-center">
              <select
                value={commissionInputs[emp.id]?.name || ""}
                onChange={(e) => handleInputChange(emp.id, "name", e.target.value)}
                className="border p-1 rounded-md w-64"
              >
                <option value="" disabled>
                  Select Role
                </option>
                {commissionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  placeholder="Salary"
                  value={commissionInputs[emp.id]?.salaryValue || ""}
                  onChange={(e) =>
                    handleInputChange(emp.id, "salaryValue", Number(e.target.value))
                  }
                  className="border p-1 pl-6 rounded-md w-48"
                />
              </div>

              <div className="relative">
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                <input
                  type="number"
                  placeholder="Commission"
                  value={commissionInputs[emp.id]?.commissionValue || ""}
                  onChange={(e) =>
                    handleInputChange(emp.id, "commissionValue", Number(e.target.value))
                  }
                  className="border p-1 pr-6 rounded-md w-48"
                />
              </div>

              <button
                onClick={() => addCommission(emp.id)}
                className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700 transition-colors"
              >
                Add
              </button>
            </div>

            <div className="mt-4">
              <div className="grid grid-cols-[1fr,1fr,1fr,auto] text-xs font-semibold text-gray-500 border-b pb-1 mb-2">
                <span>Role</span>
                <span>Amount ($)</span>
                <span>Commission (%)</span>
                <span className="sr-only">Actions</span>
              </div>
              <ul className="text-gray-700 text-sm space-y-2">
                {emp.commissions.map((c, idx) => (
                  <li key={idx} className="grid grid-cols-[1fr,1fr,1fr,auto] gap-2 items-center">
                    <span className="font-medium truncate">{c.name}</span>
                    <span className="text-gray-900">${c.salaryValue.toLocaleString()}</span>
                    <span className="text-gray-900">{c.commissionValue}%</span>
                    <button
                      onClick={() => removeCommission(emp.id, idx)}
                      className="text-red-500 hover:text-red-700 transition-colors justify-self-end"
                      aria-label={`Remove commission for ${c.name}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.728-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to remove the employee{" "}
              <span className="font-bold">{employeeToDelete?.name}</span>?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveEmployee}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}