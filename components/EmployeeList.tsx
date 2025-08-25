"use client";
import { useState } from "react";
import type { Employee } from "@/app/types"; // import shared types

type EmployeeListProps = {
  employees?: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
};

export default function EmployeeList({ employees = [], setEmployees }: EmployeeListProps) {
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [commissionInputs, setCommissionInputs] = useState<{
    [key: number]: { name: string; value: number; type: "Direct" | "JV Split" };
  }>({});

  // Commission name options
  const commissionOptions = [
    "Acquisition Agent",
    "Disposition Agent",
    "General Manager",
    "Transaction Coordinator",
    "Underwriter",
    "Other",
  ] as const;

  // JV Split percentage options 10%-90%
  const jvSplitOptions = Array.from({ length: 9 }, (_, i) => (i + 1) * 10);

  // Add employee
  const addEmployee = () => {
    if (!newEmployeeName.trim()) return;
    setEmployees([
      ...employees,
      { id: Date.now(), name: newEmployeeName, commissions: [] },
    ]);
    setNewEmployeeName("");
  };

  // Add commission to employee
  const addCommission = (empId: number) => {
    const input = commissionInputs[empId];
    if (!input?.name || input.value === undefined) return;

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === empId
          ? { ...emp, commissions: [...emp.commissions, input] }
          : emp
      )
    );

    // Reset inputs
    setCommissionInputs((prev) => ({
      ...prev,
      [empId]: { name: "", value: 50, type: "Direct" }, // default value
    }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4">Employee List</h2>

      {/* Add Employee */}
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
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Employee
        </button>
      </div>

      {/* Employee List */}
      <div className="space-y-4">
        {employees.length === 0 && (
          <p className="text-gray-500">No employees added yet.</p>
        )}
        {employees.map((emp) => (
          <div key={emp.id} className="border p-3 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{emp.name}</span>
              <span className="text-gray-500">
                {emp.commissions.length} commission(s)
              </span>
            </div>

            {/* Add Commission Form */}
            <div className="flex space-x-2 mb-2 items-center">
              {/* Commission Name */}
              <select
                value={commissionInputs[emp.id]?.name || ""}
                onChange={(e) =>
                  setCommissionInputs((prev) => ({
                    ...prev,
                    [emp.id]: {
                      ...prev[emp.id],
                      name: e.target.value,
                      value: prev[emp.id]?.value || 50,
                      type: prev[emp.id]?.type || "Direct",
                    },
                  }))
                }
                className="border p-1 rounded-md w-48"
              >
                <option value="" disabled>
                  Select Commission
                </option>
                {commissionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {/* Type Dropdown */}
              <select
                value={commissionInputs[emp.id]?.type || "Direct"}
                onChange={(e) =>
                  setCommissionInputs((prev) => ({
                    ...prev,
                    [emp.id]: {
                      ...prev[emp.id],
                      type: e.target.value as "Direct" | "JV Split",
                      value:
                        e.target.value === "JV Split"
                          ? 50
                          : prev[emp.id]?.value || 0,
                      name: prev[emp.id]?.name || "",
                    },
                  }))
                }
                className="border p-1 rounded-md w-32"
              >
                <option value="Direct">Direct</option>
                <option value="JV Split">JV Split</option>
              </select>

              {/* Value Input / Dropdown */}
              {commissionInputs[emp.id]?.type === "JV Split" ? (
                <select
                  value={commissionInputs[emp.id]?.value || 50}
                  onChange={(e) =>
                    setCommissionInputs((prev) => ({
                      ...prev,
                      [emp.id]: {
                        ...prev[emp.id],
                        value: Number(e.target.value),
                        name: prev[emp.id]?.name || "",
                        type: prev[emp.id]?.type || "JV Split",
                      },
                    }))
                  }
                  className="border p-1 rounded-md w-24"
                >
                  {jvSplitOptions.map((v) => (
                    <option key={v} value={v}>
                      {v}%
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
                  placeholder="Value"
                  value={commissionInputs[emp.id]?.value || 0}
                  onChange={(e) =>
                    setCommissionInputs((prev) => ({
                      ...prev,
                      [emp.id]: {
                        ...prev,
                        value: Number(e.target.value),
                        name: prev[emp.id]?.name || "",
                        type: prev[emp.id]?.type || "Direct",
                      },
                    }))
                  }
                  className="border p-1 rounded-md w-24"
                />
              )}

              {/* Add Commission Button */}
              <button
                onClick={() => addCommission(emp.id)}
                className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700"
              >
                Add Commission
              </button>
            </div>

            {/* List of Commissions */}
            <ul className="text-gray-700 text-sm">
              {emp.commissions.map((c, idx) => (
                <li key={idx}>
                  {c.name}: {c.value}
                  {c.type === "JV Split" ? "%" : "$"} ({c.type})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
