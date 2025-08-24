"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Establishment = {
  est_name?: string;
  member_id?: string;
  office?: string;
  doj_epf?: string;
  doe_epf?: string;
  doe_eps?: string;
  pf_balance?: {
    net_balance?: string;
    employee_share?: { credit?: string; balance?: string };
    employer_share?: { credit?: string; balance?: string };
  };
};

async function fetchPFReport(phone: string) {
  const res = await fetch(`http://localhost:5000/fetch_epf_details/${phone}`);
  if (!res.ok) throw new Error("Failed to fetch PF report");
  return res.json();
}

const EPFReport = ({ phone }: { phone: string }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["pfReport", phone],
    queryFn: () => fetchPFReport(phone),
    enabled: !!phone,
  });

  if (isLoading)
    return (
      <div className="grid place-items-center h-full text-xl font-bold">
        Loading PF report...
      </div>
    );

  if (isError)
    return <div>Error: {(error as Error)?.message ?? "Unknown error"}</div>;

  const rawDetails = data?.uanAccounts?.[0]?.rawDetails;
  if (!rawDetails)
    return (
      <div className="p-6 text-center text-gray-500">
        No PF report available for this user.
      </div>
    );

  const est_details: Establishment[] = rawDetails?.est_details ?? [];
  const overall_pf_balance = rawDetails?.overall_pf_balance ?? {};

  return (
    <div className="p-4 space-y-6">
      <div className="border p-4 rounded shadow dark:border-neutral-500 dark:border-[2px]">
        <h1 className="font-bold text-xl underline underline-offset-2">
          PF Report
        </h1>

        <OverallBalance overall={overall_pf_balance} />
        <EstablishmentTable estDetails={est_details} />
      </div>
    </div>
  );
};

export default EPFReport;

function OverallBalance({ overall }: { overall: Record<string, any> }) {
  return (
    <div className="mt-4">
      <h2 className="font-bold text-lg mb-2">Overall PF Balance</h2>
      <ul className="list-disc ml-6">
        <li>Pension Balance: {overall?.pension_balance ?? 0}</li>
        <li>Current PF Balance: {overall?.current_pf_balance ?? 0}</li>
        <li>
          Employee Share Total: {overall?.employee_share_total?.balance ?? 0}
        </li>
        <li>
          Employer Share Total: {overall?.employer_share_total?.balance ?? 0}
        </li>
      </ul>
    </div>
  );
}

function EstablishmentTable({ estDetails }: { estDetails: Establishment[] }) {
  if (!estDetails || estDetails.length === 0)
    return (
      <div className="p-4 text-center text-gray-500">
        No establishment details available.
      </div>
    );

  const totals = calculateTotals(estDetails);

  return (
    <div className="my-4">
      <h2 className="font-bold text-lg mb-2">Establishment Details</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Establishment</TableHead>
            <TableHead>Office</TableHead>
            <TableHead>DOJ</TableHead>
            <TableHead>DOE (EPF)</TableHead>
            <TableHead className="text-right">Net Balance</TableHead>
            <TableHead className="text-right">Employee Share</TableHead>
            <TableHead className="text-right">Employer Share</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {estDetails.map((est, idx) => (
            <TableRow key={idx}>
              <TableCell>{est?.est_name ?? "-"}</TableCell>
              <TableCell>{est?.office ?? "-"}</TableCell>
              <TableCell>{est?.doj_epf ?? "-"}</TableCell>
              <TableCell>{est?.doe_epf ?? "-"}</TableCell>
              <TableCell className="text-right">
                {est?.pf_balance?.net_balance ?? 0}
              </TableCell>
              <TableCell className="text-right">
                {est?.pf_balance?.employee_share?.balance ?? 0}
              </TableCell>
              <TableCell className="text-right">
                {est?.pf_balance?.employer_share?.balance ?? 0}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-right">{totals.balance}</TableCell>
            <TableCell className="text-right">{totals.employee}</TableCell>
            <TableCell className="text-right">{totals.employer}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

function calculateTotals(estDetails: Establishment[]) {
  return estDetails.reduce(
    (acc, e) => {
      acc.balance += Number(e?.pf_balance?.net_balance ?? 0);
      acc.employee += Number(e?.pf_balance?.employee_share?.balance ?? 0);
      acc.employer += Number(e?.pf_balance?.employer_share?.balance ?? 0);
      return acc;
    },
    { balance: 0, employee: 0, employer: 0 }
  );
}
