"use client";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type DonutProps = {
  labels: string[];
  data: number[];
};

export default function Donut({ labels, data }: DonutProps) {
  const chartData: ChartData<"doughnut"> = {
    labels,
    datasets: [
      {
        label: "Commissions",
        data,
        backgroundColor: [
          "#3B82F6",
          "#EF4444",
          "#10B981",
          "#F59E0B",
          "#8B5CF6",
          "#EC4899",
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Doughnut data={chartData} />;
}
