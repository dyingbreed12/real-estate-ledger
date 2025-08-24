"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

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

type GraphsProps = {
  employees?: Employee[];
  assignmentFee?: number;
};

export default function Graphs({
  employees = [],
  assignmentFee = 20000,
}: GraphsProps) {
  // Calculate total commission per employee
  const labels = employees.map(emp => emp.name);
  const dataValues = employees.map(emp =>
    emp.commissions.reduce((sum, c) => {
      return sum + (c.type === "Fixed" ? c.value : (assignmentFee * c.value) / 100);
    }, 0)
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Total Commission",
        data: dataValues,
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4">Total Commissions per Employee</h2>
      {employees.length > 0 ? (
        <Bar data={data} />
      ) : (
        <p className="text-gray-500">No employees to display.</p>
      )}
    </div>
  );
}
