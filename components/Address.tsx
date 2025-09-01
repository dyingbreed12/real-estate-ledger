"use client";

type AddressProps = {
  address?: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  ownershipType?: "Direct" | "JV Split";
  setOwnershipType: React.Dispatch<React.SetStateAction<"Direct" | "JV Split">>;
  ownershipPercentage?: number;
  setOwnershipPercentage: React.Dispatch<React.SetStateAction<number>>;
};

export default function Address({
  address = "",
  setAddress,
  ownershipType = "Direct",
  setOwnershipType,
  ownershipPercentage = 50,
  setOwnershipPercentage,
}: AddressProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Property Address & Ownership
      </h2>

      <div className="space-y-6">
        {/* Address Input */}
        <div className="flex flex-col space-y-2">
          <label className="text-gray-600 font-medium">Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter property address"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 text-gray-900"
          />
        </div>

        {/* Ownership Type */}
        <div className="flex flex-col space-y-2">
          <label className="text-gray-600 font-medium">Ownership Type:</label>
          <select
            value={ownershipType}
            onChange={(e) =>
              setOwnershipType(e.target.value as "Direct" | "JV Split")
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 text-gray-900"
          >
            <option value="Direct">Direct</option>
            <option value="JV Split">JV Split</option>
          </select>
        </div>

        {/* JV Percentage - Conditional */}
        {ownershipType === "JV Split" && (
          <div className="flex flex-col space-y-2">
            <label className="text-gray-600 font-medium">JV Percentage:</label>
            <select
              value={ownershipPercentage}
              onChange={(e) => setOwnershipPercentage(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 text-gray-900"
            >
              {Array.from({ length: 9 }, (_, i) => (i + 1) * 10).map((val) => (
                <option key={val} value={val}>
                  {val}%
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}