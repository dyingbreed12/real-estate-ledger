"use client";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

type DonutChartProps = {
  value: number;
  remaining: number;
  label: string;
  colors?: [string, string];
};

export default function DonutChart({ value, remaining, label, colors = ["#7c3aed", "#e5e7eb"] }: DonutChartProps) {
  const data = [
    { name: label, value },
    { name: "Remaining", value: remaining },
  ];

  return (
    <PieChart width={200} height={200}>
      <Pie
        data={data}
        dataKey="value"
        innerRadius={60}
        outerRadius={80}
        paddingAngle={5}
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend verticalAlign="bottom" height={36} />
    </PieChart>
  );
}
