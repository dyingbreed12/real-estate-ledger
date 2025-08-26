"use client";

import { useState, useEffect } from "react";
import EmployeeList from "@/components/EmployeeList";
import type { Employee, OwnershipType } from "@/app/types";
import Address from "@/components/Address";
import Calculator from "@/components/Calculator";
import Widgets from "@/components/Widgets";

export default function DashboardPage() {
  const [hydrated, setHydrated] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [address, setAddress] = useState("");
  const [ownershipType, setOwnershipType] = useState<OwnershipType>("Direct");
  const [ownershipPercentage, setOwnershipPercentage] = useState(50);
  const [assignmentFee, setAssignmentFee] = useState(20000);
  
  // New state variables to hold final calculated values
  const [netProfit, setNetProfit] = useState(0);
  const [netProfitMargin, setNetProfitMargin] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmployees = localStorage.getItem("employees");
      const storedAddress = localStorage.getItem("address");
      const storedOwnershipType = localStorage.getItem("ownershipType") as OwnershipType;
      const storedOwnershipPercentage = localStorage.getItem("ownershipPercentage");
      const storedAssignmentFee = localStorage.getItem("assignmentFee");

      setEmployees(storedEmployees ? JSON.parse(storedEmployees) : []);
      setAddress(storedAddress || "");
      setOwnershipType(storedOwnershipType || "Direct");
      setOwnershipPercentage(storedOwnershipPercentage ? Number(storedOwnershipPercentage) : 50);
      setAssignmentFee(storedAssignmentFee ? Number(storedAssignmentFee) : 20000);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
      if (!hydrated) return;
      localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees, hydrated]);
  
  useEffect(() => {
      if (!hydrated) return;
      localStorage.setItem("address", address);
  }, [address, hydrated]);
  
  useEffect(() => {
      if (!hydrated) return;
      localStorage.setItem("ownershipType", ownershipType);
  }, [ownershipType, hydrated]);
  
  useEffect(() => {
      if (!hydrated) return;
      localStorage.setItem("ownershipPercentage", ownershipPercentage.toString());
  }, [ownershipPercentage, hydrated]);
  
  useEffect(() => {
      if (!hydrated) return;
      localStorage.setItem("assignmentFee", assignmentFee.toString());
  }, [assignmentFee, hydrated]);

  if (!hydrated) return <p className="text-center mt-10 text-gray-500">Loading dashboard...</p>;

  return (
    <div className="space-y-8 pt-4 -mt-12">

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
          assignmentFee={assignmentFee}
          setAssignmentFee={setAssignmentFee}
          ownershipType={ownershipType}
          ownershipPercentage={ownershipPercentage}
          onCalculate={(calculatedNetProfit, calculatedNetProfitMargin) => {
            setNetProfit(calculatedNetProfit);
            setNetProfitMargin(calculatedNetProfitMargin);
          }}
        />
      </section>

      <section id="widgets">
        <Widgets netProfit={netProfit} netProfitMargin={netProfitMargin} />
      </section>
    </div>
  );
}