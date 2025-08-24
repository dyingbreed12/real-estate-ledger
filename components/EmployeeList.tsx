"use client";
import { useState } from "react";

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

type EmployeeListProps = {
  employees?: Employee[]; // make it optional
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
};

export default function EmployeeList({ employees = [], setEmployees }: EmployeeListProps) {
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [commissionInputs, setCommissionInputs] = useState<{
    [key: number]: { name: string; value: number; type: "Fixed" | "Percentage" };
  }>({});

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

    // Clear input for this employee
    setCommissionInputs((prev) => ({
      ...prev,
      [empId]: { name: "", value: 0, type: "Fixed" },
    }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4">Employee List</h2>

      {/* Add Employee Form */}
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
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                placeholder="Commission Name"
                value={commissionInputs[emp.id]?.name || ""}
                onChange={(e) =>
                  setCommissionInputs((prev) => ({
                    ...prev,
                    [emp.id]: {
                      ...prev[emp.id],
                      name: e.target.value,
                      value: prev[emp.id]?.value || 0,
                      type: prev[emp.id]?.type || "Fixed",
                    },
                  }))
                }
                className="border p-1 rounded-md flex-1"
              />
              <input
                type="number"
                placeholder="Value"
                value={commissionInputs[emp.id]?.value || 0}
                onChange={(e) =>
                  setCommissionInputs((prev) => ({
                    ...prev,
                    [emp.id]: {
                      ...prev[emp.id],
                      value: Number(e.target.value),
                      name: prev[emp.id]?.name || "",
                      type: prev[emp.id]?.type || "Fixed",
                    },
                  }))
                }
                className="border p-1 rounded-md w-20"
              />
              <select
                value={commissionInputs[emp.id]?.type || "Fixed"}
                onChange={(e) =>
                  setCommissionInputs((prev) => ({
                    ...prev,
                    [emp.id]: {
                      ...prev[emp.id],
                      type: e.target.value as "Fixed" | "Percentage",
                      name: prev[emp.id]?.name || "",
                      value: prev[emp.id]?.value || 0,
                    },
                  }))
                }
                className="border p-1 rounded-md"
              >
                <option value="Fixed">Fixed</option>
                <option value="Percentage">Percentage</option>
              </select>
              <button
                onClick={() => addCommission(emp.id)}
                className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700"
              >
                Add
              </button>
            </div>

            {/* List of Commissions */}
            <ul className="text-gray-700 text-sm">
              {emp.commissions.map((c, idx) => (
                <li key={idx}>
                  {c.name}: {c.value}
                  {c.type === "Percentage" ? "%" : "$"}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
