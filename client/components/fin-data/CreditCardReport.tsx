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

type Account = {
  subscriberName?: string;
  currentBalance?: string;
  creditLimitAmount?: string;
};

const CreditCardReport = ({ phone }: { phone: string }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["creditReport", phone],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5000/fetch_credit_report/${phone}`
      );
      if (!res.ok) throw new Error("Failed to fetch credit report");
      return res.json();
    },
    enabled: !!phone,
  });

  if (isLoading)
    return (
      <div className="grid place-items-center h-full text-xl font-bold">
        Loading credit report...
      </div>
    );

  if (isError) return <div>Error: {(error as Error).message}</div>;

  // Safe fallback if response is empty or missing
  const report =
    data?.fetch_credit_report?.creditReports?.[0]?.creditReportData ?? null;
  if (!report)
    return (
      <div className="p-6 text-center text-gray-500">
        No credit report available for this user.
      </div>
    );

  const accounts: Account[] =
    report?.creditAccount?.creditAccountDetails ?? [];
  const reportDate = report?.creditProfileHeader?.reportDate ?? "N/A";
  const score = report?.score?.bureauScore ?? "N/A";
  const accountSummary = report?.creditAccount?.creditAccountSummary?.account ?? {};
  const totalOutstanding =
    report?.creditAccount?.creditAccountSummary?.totalOutstandingBalance ?? {};

  return (
    <div className="p-4 -mt-3 space-y-4">
      <div className="border p-4 rounded-xl shadow dark:border-neutral-500 dark:border-[2px]">
        <h1 className="font-bold text-xl underline underline-offset-2">
          Credit Report
        </h1>
        <div className="mt-2">
          <p>
            <strong>Report Date:</strong> {reportDate}
          </p>
          <p>
            <strong>Bureau Score:</strong> {score}
          </p>
        </div>

        <div className="mt-4">
          <h2 className="font-bold text-lg mb-2">Account Summary</h2>
          <ul className="list-disc ml-6">
            <li>Total Accounts: {accountSummary?.creditAccountTotal ?? 0}</li>
            <li>Active: {accountSummary?.creditAccountActive ?? 0}</li>
            <li>Closed: {accountSummary?.creditAccountClosed ?? 0}</li>
            <li>Defaults: {accountSummary?.creditAccountDefault ?? 0}</li>
            <li>
              Total Outstanding Balance:{" "}
              {totalOutstanding?.outstandingBalanceAll ?? 0}
            </li>
          </ul>
        </div>

        <CreditReportTable accounts={accounts} />
      </div>
    </div>
  );
};

export default CreditCardReport;

function CreditReportTable({ accounts }: { accounts: Account[] }) {
  // Safe calculations
  const totalBalance = accounts.reduce(
    (sum, acc) => sum + Number(acc?.currentBalance ?? 0),
    0
  );
  const totalLimit = accounts.reduce(
    (sum, acc) => sum + Number(acc?.creditLimitAmount ?? 0),
    0
  );

  if (!accounts || accounts.length === 0)
    return (
      <div className="p-4 text-center text-gray-500">
        No account details available.
      </div>
    );

  return (
    <div className="my-4">
      <h2 className="font-bold text-lg mb-2">Account Details</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subscriber</TableHead>
            <TableHead className="text-right">Current Balance</TableHead>
            <TableHead className="text-right">Credit Limit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((acc, idx) => (
            <TableRow key={idx}>
              <TableCell>{acc?.subscriberName ?? "-"}</TableCell>
              <TableCell className="text-right">{acc?.currentBalance ?? 0}</TableCell>
              <TableCell className="text-right">{acc?.creditLimitAmount ?? 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell className="text-right">{totalBalance}</TableCell>
            <TableCell className="text-right">{totalLimit}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
