"use client";
import { useState } from "react";
import EmployeeList from "@/components/EmployeeList";
import Address from "@/components/Address";
import Calculator from "@/components/Calculator";
import Graphs from "@/components/Graphs";

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

export default function DashboardPage() {
  // Global state for employees
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Global state for address and ownership
  const [address, setAddress] = useState("");
  const [ownershipType, setOwnershipType] = useState<"Direct" | "JV Split">("Direct");
  const [ownershipPercentage, setOwnershipPercentage] = useState(50);

  return (
    <div className="space-y-8 p-6">
      <section id="employees">
        <EmployeeList employees={employees} setEmployees={setEmployees} />
      </section>

      <section id="address">
        <Address
          address={address}
          setAddress={setAddress}
          ownershipType={ownershipType}
          setOwnershipType={setOwnershipType}
          ownershipPercentage={ownershipPercentage}
          setOwnershipPercentage={setOwnershipPercentage}
        />
      </section>

      <section id="calculator">
        <Calculator
          employees={employees}
          ownershipType={ownershipType}
          setOwnershipType={setOwnershipType}
          ownershipPercentage={ownershipPercentage}
          setOwnershipPercentage={setOwnershipPercentage}
        />
      </section>

      <section id="graphs">
        <Graphs employees={employees} />
      </section>
    </div>
  );
}
