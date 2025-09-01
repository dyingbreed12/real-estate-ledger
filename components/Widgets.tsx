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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-xl text-center flex flex-col items-center justify-center">
        <h3 className="text-gray-600 font-medium text-lg">Net Profit</h3>
        <p className="text-3xl font-bold mt-2 text-gray-900">${netProfit.toLocaleString()}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl text-center flex flex-col items-center justify-center">
        <h3 className="text-gray-600 font-medium text-lg">Net Profit Margin</h3>
        <p className="text-3xl font-bold mt-2 text-gray-900">{netProfitMargin.toFixed(2)}%</p>
      </div>
    </div>
  );
}