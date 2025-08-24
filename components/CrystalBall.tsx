"use client";

import { useState } from "react";

type CrystalBallProps = {
  dealsPerMonth?: number;
  avgAssignmentFee?: number;
  ownershipType?: "Direct" | "JV Split";
  ownershipPercentage?: number; // Only for JV Split
  netProfitMargin?: number; // percentage 0-100
};

export default function CrystalBall({
  dealsPerMonth = 10,
  avgAssignmentFee = 20000,
  ownershipType = "Direct",
  ownershipPercentage = 50,
  netProfitMargin = 50,
}: CrystalBallProps) {
  const [showResults, setShowResults] = useState(false);

  // Calculate ownership factor
  const ownershipFactor = ownershipType === "Direct" ? 1 : ownershipPercentage / 100;

  // Calculate monthly and annual profit
  const monthlyProfit = dealsPerMonth * avgAssignmentFee * (netProfitMargin / 100) * ownershipFactor;
  const annualProfit = monthlyProfit * 12;

  // Handle Crystal Ball click
  const handleClick = () => {
    setShowResults(false);
    setTimeout(() => setShowResults(true), 500); // simple "magic delay"
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-6">
      <h2 className="text-xl font-semibold text-center">🔮 Crystal Ball Forecast</h2>

      <div className="flex justify-center">
        <button
          onClick={handleClick}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
        >
          Reveal Forecast
        </button>
      </div>

      {showResults && (
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 mt-6">
          <div className="flex-1 bg-purple-100 p-4 rounded-lg text-center animate-pulse">
            <h3 className="font-medium text-gray-700">Monthly Profit</h3>
            <p className="text-2xl font-bold text-purple-700">${monthlyProfit.toLocaleString()}</p>
          </div>

          <div className="flex-1 bg-blue-100 p-4 rounded-lg text-center animate-pulse">
            <h3 className="font-medium text-gray-700">Annual Profit</h3>
            <p className="text-2xl font-bold text-blue-700">${annualProfit.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
