"use client";
import { useState, useEffect } from "react";
import EmployeeList from "@/components/EmployeeList";
import Address from "@/components/Address";
import Calculator from "@/components/Calculator";
import Graphs from "@/components/Graphs";

export default function DashboardPage() {
  // Employees
  const [employees, setEmployees] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("employees");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // Address & Ownership
  const [address, setAddress] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("address") || "";
    }
    return "";
  });

  const [ownershipType, setOwnershipType] = useState<"Direct" | "JV Split">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("ownershipType") as "Direct" | "JV Split") || "Direct";
    }
    return "Direct";
  });

  const [ownershipPercentage, setOwnershipPercentage] = useState(() => {
    if (typeof window !== "undefined") {
      const val = localStorage.getItem("ownershipPercentage");
      return val ? Number(val) : 50;
    }
    return 50;
  });

  const [assignmentFee, setAssignmentFee] = useState(() => {
    if (typeof window !== "undefined") {
      const val = localStorage.getItem("assignmentFee");
      return val ? Number(val) : 20000;
    }
    return 20000;
  });

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem("address", address);
  }, [address]);

  useEffect(() => {
    localStorage.setItem("ownershipType", ownershipType);
  }, [ownershipType]);

  useEffect(() => {
    localStorage.setItem("ownershipPercentage", ownershipPercentage.toString());
  }, [ownershipPercentage]);

  useEffect(() => {
    localStorage.setItem("assignmentFee", assignmentFee.toString());
  }, [assignmentFee]);

  return (
    <div className="space-y-8">
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
