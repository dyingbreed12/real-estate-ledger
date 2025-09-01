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
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4">
        Property Address & Ownership
      </h2>

      <div className="space-y-4">
        {/* Address Input */}
        <div>
          <label className="block mb-1 font-medium">Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter property address"
            className="border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Ownership Type */}
        <div>
          <label className="block mb-1 font-medium">Ownership Type:</label>
          <select
            value={ownershipType}
            onChange={(e) =>
              setOwnershipType(e.target.value as "Direct" | "JV Split")
            }
            className="border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="Direct">Direct</option>
            <option value="JV Split">JV Split</option>
          </select>
        </div>

        {/* JV Percentage - Conditional */}
        {ownershipType === "JV Split" && (
          <div>
            <label className="block mb-1 font-medium">JV Percentage:</label>
            <select
              value={ownershipPercentage}
              onChange={(e) => setOwnershipPercentage(Number(e.target.value))}
              className="border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
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