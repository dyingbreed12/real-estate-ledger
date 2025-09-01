"use client";

import { useState, useEffect } from "react";
import EmployeeList from "@/components/EmployeeList";
import type { Employee, OwnershipType } from "@/app/types";
import Address from "@/components/Address";
import Calculator from "@/components/Calculator";
import Widgets from "@/components/Widgets";

// Define the default values
const DEFAULT_EMPLOYEES: Employee[] = [];
const DEFAULT_ADDRESS = "";
const DEFAULT_OWNERSHIP_TYPE: OwnershipType = "Direct";
const DEFAULT_OWNERSHIP_PERCENTAGE = 50;
const DEFAULT_ASSIGNMENT_FEE = 20000;

export default function DashboardPage() {
  const [hydrated, setHydrated] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>(DEFAULT_EMPLOYEES);
  const [address, setAddress] = useState(DEFAULT_ADDRESS);
  const [ownershipType, setOwnershipType] = useState<OwnershipType>(DEFAULT_OWNERSHIP_TYPE);
  const [ownershipPercentage, setOwnershipPercentage] = useState(DEFAULT_OWNERSHIP_PERCENTAGE);
  const [assignmentFee, setAssignmentFee] = useState(DEFAULT_ASSIGNMENT_FEE);

  // New state variables to hold final calculated values
  const [netProfit, setNetProfit] = useState(0);
  const [netProfitMargin, setNetProfitMargin] = useState(0);

useEffect(() => {
  if (typeof window !== "undefined") {
    try {
      const storedEmployees = localStorage.getItem("employees");
      let parsedEmployees: Employee[] = DEFAULT_EMPLOYEES;
      if (storedEmployees) {
        try {
          const parsed = JSON.parse(storedEmployees);
          // Stronger validation: Check if it's an array and if all items are objects
          if (Array.isArray(parsed) && parsed.every(emp => typeof emp === 'object' && emp !== null)) {
            parsedEmployees = parsed as Employee[];
          } else {
            // Invalid data found, log a warning and clear it
            console.warn("Invalid employees data in localStorage. Clearing it.");
            localStorage.removeItem("employees");
          }
        } catch (error) {
          console.error("Failed to parse employees from localStorage:", error);
          localStorage.removeItem("employees");
        }
      }
      setEmployees(parsedEmployees);

      // Repeat the same validation pattern for other items as needed
      const storedAddress = localStorage.getItem("address");
      setAddress(typeof storedAddress === 'string' ? storedAddress : DEFAULT_ADDRESS);

      const storedOwnershipType = localStorage.getItem("ownershipType") as OwnershipType;
      setOwnershipType(storedOwnershipType === "Direct" || storedOwnershipType === "JV Split" ? storedOwnershipType : DEFAULT_OWNERSHIP_TYPE);

      const storedOwnershipPercentage = localStorage.getItem("ownershipPercentage");
      setOwnershipPercentage(storedOwnershipPercentage && !isNaN(Number(storedOwnershipPercentage)) ? Number(storedOwnershipPercentage) : DEFAULT_OWNERSHIP_PERCENTAGE);

      const storedAssignmentFee = localStorage.getItem("assignmentFee");
      setAssignmentFee(storedAssignmentFee && !isNaN(Number(storedAssignmentFee)) ? Number(storedAssignmentFee) : DEFAULT_ASSIGNMENT_FEE);

    } catch (error) {
      // This catch block handles any other unexpected localStorage access errors.
      console.error("An error occurred while accessing localStorage:", error);
      localStorage.clear(); // Clear all data as a failsafe
      // Reset all states to default values
      setEmployees(DEFAULT_EMPLOYEES);
      setAddress(DEFAULT_ADDRESS);
      setOwnershipType(DEFAULT_OWNERSHIP_TYPE);
      setOwnershipPercentage(DEFAULT_OWNERSHIP_PERCENTAGE);
      setAssignmentFee(DEFAULT_ASSIGNMENT_FEE);
    }
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
          setNetProfit={setNetProfit}
          setNetProfitMargin={setNetProfitMargin}
        />
      </section>

      <section id="widgets">
        <Widgets netProfit={netProfit} netProfitMargin={netProfitMargin} />
      </section>
    </div>
  );
}