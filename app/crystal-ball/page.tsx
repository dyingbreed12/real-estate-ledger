"use client";
import { useState } from "react";
import CrystalBall from "@/components/CrystalBall";

export default function CrystalBallPage() {
  const [dealsPerMonth, setDealsPerMonth] = useState(10);
  const [avgAssignmentFee, setAvgAssignmentFee] = useState(20000);
  const [ownershipType, setOwnershipType] = useState<"Direct" | "JV Split">("Direct");
  const [ownershipPercentage, setOwnershipPercentage] = useState(50);
  const [netProfitMargin, setNetProfitMargin] = useState(50);

  // Generate dropdown options 10% to 90%
  const ownershipOptions = Array.from({ length: 9 }, (_, i) => (i + 1) * 10);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <h1 className="text-2xl font-bold">Crystal Ball Forecast</h1>

      {/* Form Inputs */}
      <div className="bg-white p-6 rounded-2xl shadow space-y-4">
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
          <label className="flex-1">
            Deals per Month
            <input
              type="number"
              value={dealsPerMonth}
              onChange={(e) => setDealsPerMonth(Number(e.target.value))}
              className="w-full border p-2 rounded-md"
            />
          </label>

          <label className="flex-1">
            Average Assignment Fee
            <input
              type="number"
              value={avgAssignmentFee}
              onChange={(e) => setAvgAssignmentFee(Number(e.target.value))}
              className="w-full border p-2 rounded-md"
            />
          </label>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
          <label className="flex-1">
            Ownership Type
            <select
              value={ownershipType}
              onChange={(e) => setOwnershipType(e.target.value as "Direct" | "JV Split")}
              className="w-full border p-2 rounded-md"
            >
              <option value="Direct">Direct</option>
              <option value="JV Split">JV Split</option>
            </select>
          </label>

          {ownershipType === "JV Split" && (
            <label className="flex-1">
              Ownership %
              <select
                value={ownershipPercentage}
                onChange={(e) => setOwnershipPercentage(Number(e.target.value))}
                className="w-full border p-2 rounded-md"
              >
                {ownershipOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}%
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="flex-1">
            Net Profit Margin %
            <input
              type="number"
              value={netProfitMargin}
              onChange={(e) => setNetProfitMargin(Number(e.target.value))}
              className="w-full border p-2 rounded-md"
              min={0}
              max={100}
            />
          </label>
        </div>
      </div>

      {/* Crystal Ball Component */}
      <CrystalBall
        dealsPerMonth={dealsPerMonth}
        avgAssignmentFee={avgAssignmentFee}
        ownershipType={ownershipType}
        ownershipPercentage={ownershipPercentage}
        netProfitMargin={netProfitMargin}
      />
    </div>
  );
}
