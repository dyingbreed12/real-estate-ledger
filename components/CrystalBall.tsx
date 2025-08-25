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
  const [isAnimating, setIsAnimating] = useState(false);

  const ownershipFactor = ownershipType === "Direct" ? 1 : ownershipPercentage / 100;

  const monthlyProfit = dealsPerMonth * avgAssignmentFee * (netProfitMargin / 100) * ownershipFactor;
  const annualProfit = monthlyProfit * 12;

  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setShowResults(false);

    const delay = 2000 + Math.random() * 3000;

    setTimeout(() => {
      setIsAnimating(false);
      setShowResults(true);
    }, delay);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-6 flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-center">🔮 Crystal Ball Forecast</h2>

      {/* Crystal Ball Image */}
      <div
        onClick={handleClick}
        className={`relative w-32 h-32 cursor-pointer rounded-full flex items-center justify-center transition-transform duration-500 ${
          isAnimating ? "animate-crystal" : "hover:scale-110"
        }`}
        title="Click the crystal ball to reveal forecast"
      >
        {/* Glowing aura */}
        <div
          className={`absolute w-40 h-40 rounded-full bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 opacity-50 blur-3xl transition-all ${
            isAnimating ? "animate-pulse" : "hover:opacity-70"
          }`}
        ></div>

        {/* Inner reflection/light streak */}
        <div className="absolute w-32 h-32 rounded-full bg-white/20 rounded-t-full transform rotate-12 pointer-events-none"></div>

        {/* Crystal Ball Image */}
        <img
          src="/crystal-ball.png"
          alt="Crystal Ball"
          className="w-24 h-24 z-10 object-contain drop-shadow-xl"
        />
      </div>

      {/* Results */}
      {showResults && (
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 mt-6 w-full">
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

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes crystalAnimation {
          0% { transform: scale(1) rotate(0deg); box-shadow: 0 0 20px rgba(255,255,255,0.5); }
          25% { transform: scale(1.2) rotate(10deg); box-shadow: 0 0 40px rgba(255,255,255,0.8); }
          50% { transform: scale(1.1) rotate(-10deg); box-shadow: 0 0 60px rgba(255,255,255,1); }
          75% { transform: scale(1.2) rotate(10deg); box-shadow: 0 0 40px rgba(255,255,255,0.8); }
          100% { transform: scale(1) rotate(0deg); box-shadow: 0 0 20px rgba(255,255,255,0.5); }
        }

        .animate-crystal {
          animation: crystalAnimation 2.5s ease-in-out forwards;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }

        .animate-pulse {
          animation: pulse 2.5s infinite;
        }
      `}</style>
    </div>
  );
}
