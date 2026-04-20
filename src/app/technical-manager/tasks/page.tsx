"use client";

import { useEffect, useState } from "react";
import API from "@/lib/axios";
import TechManagerTaskModule from "@/components/TechManagerTaskModule";

export default function TechnicalManagerTasksPage() {
  const [teamEmployees, setTeamEmployees] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await API.get("/technical-dashboard");
        setTeamEmployees(res.data.data?.teamEmployees || []);
      } catch (error) {
        console.error("Failed to load team for tasks", error);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <TechManagerTaskModule teamEmployees={teamEmployees} />
    </div>
  );
}
