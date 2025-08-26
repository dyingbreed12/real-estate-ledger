"use client";

type WidgetsProps = {
  netProfit: number;
  netProfitMargin: number;
};

export default function Widgets({
  netProfit,
  netProfitMargin,
}: WidgetsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-6 rounded-2xl shadow text-center">
        <h3 className="text-gray-500 font-medium">Net Profit</h3>
        <p className="text-2xl font-bold mt-2">${netProfit.toLocaleString()}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow text-center">
        <h3 className="text-gray-500 font-medium">Net Profit Margin</h3>
        <p className="text-2xl font-bold mt-2">{netProfitMargin.toFixed(2)}%</p>
      </div>
    </div>
  );
}