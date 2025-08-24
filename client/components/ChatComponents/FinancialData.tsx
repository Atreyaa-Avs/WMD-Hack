"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useProfile } from "@/store/useProfile";

const FinancialData = () => {
  const { phone } = useProfile();

  // TanStack Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["financialData", phone],
    queryFn: async () => {
      if (!phone) return null;
      const res = await fetch(`http://localhost:5000/data/${phone}`);
      if (!res.ok) throw new Error("Failed to fetch financial data");
      return res.json();
    },
    enabled: !!phone, // only fetch when phone exists
  });

  if (!phone) return <div>Please set your phone number.</div>;
  if (isLoading) return <div>Loading financial data...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="p-4 space-y-4">
      {data &&
        Object.entries(data).map(([key, value]) => (
          <div key={key} className="border p-2 rounded shadow">
            <h3 className="font-bold">{key.replaceAll("_", " ")}</h3>
            <pre className="text-sm break-words overflow-x-auto">
              {JSON.stringify(value, null, 2)}
            </pre>
          </div>
        ))}
    </div>
  );
};

export default FinancialData;
