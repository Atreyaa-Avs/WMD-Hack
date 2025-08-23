// components/StatusChecker.tsx
"use client";

import { useQuery } from "@tanstack/react-query";

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

  if (isLoading) return <p>Loading status...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-bold">FastAPI Status</h2>
      <p>Status: <span className="font-medium">{data?.status}</span></p>
      <p>Port: <span className="font-medium">{data.port}</span></p>
    </div>
  );
}
