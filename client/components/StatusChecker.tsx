// components/StatusChecker.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { CircleCheck } from "lucide-react";

async function fetchStatus() {
  const res = await fetch("http://localhost:5000/status");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}

export default function StatusChecker() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["status"],
    queryFn: fetchStatus,
  });

  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex justify-between p-4 mx-3 border rounded shadow-[var(--shadow-aceternity)] mt-3 dark:border-[2px] dark:border-white">
      <h2 className="text-lg font-bold">API Status</h2>
      <div className="flex items-center gap-1 font-medium">
        {isLoading ? (
          <p>Connecting...</p>
        ) : (
          <>
            <CircleCheck size={20} className="text-green-500" />
            {data?.status}
          </>
        )}
      </div>
    </div>
  );
}
