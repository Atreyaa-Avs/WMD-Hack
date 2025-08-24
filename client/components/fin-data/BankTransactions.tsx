"use client";

import React, { useState } from "react";
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
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TransactionRow = [
  string, // amount
  string, // narration
  string, // date
  number, // type
  string, // mode
  string // balance
];

const typeMap: Record<number, string> = {
  1: "CREDIT",
  2: "DEBIT",
  3: "OPENING",
  4: "INTEREST",
  5: "TDS",
  6: "INSTALLMENT",
  7: "CLOSING",
  8: "OTHERS",
};

const BankTransactions = ({ phone }: { phone: string }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["financialData", phone],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5000/fetch_bank_transactions/${phone}`
      );
      if (!res.ok) throw new Error("Failed to fetch financial data");
      return res.json() as Promise<any>;
    },
    enabled: !!phone,
  });

  if (isLoading)
    return (
      <div className="grid place-items-center h-full text-xl font-bold">
        Loading financial data...
      </div>
    );

  if (isError) return <div>Error: {(error as Error).message}</div>;

  // Safe fallback if the response is empty or missing fields
  const bankTransactions = data?.fetch_bank_transactions?.bankTransactions ?? [];

  if (bankTransactions.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No bank transaction data available for this user.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="border p-4 rounded-xl shadow dark:border-neutral-500 dark:border-[2px]">
        <h1 className="font-bold text-xl underline underline-offset-2">
          Bank Transactions
        </h1>
        {bankTransactions.map((bankData: any, indx: number) => (
          <TableComponent
            key={indx}
            bank={bankData?.bank ?? "Unknown Bank"}
            txns={bankData?.txns ?? []}
          />
        ))}
      </div>
    </div>
  );
};

export default BankTransactions;

function TableComponent({
  bank,
  txns,
}: {
  bank: string;
  txns: TransactionRow[];
}) {
  const [open, setOpen] = useState(false);

  function getTotalBalance(rows: TransactionRow[]): string {
    const total = rows.reduce((sum, row) => sum + Number(row?.[5] || 0), 0);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(total);
  }

  if (!txns || txns.length === 0) {
    return (
      <div className="my-6 border rounded shadow dark:border-neutral-500 dark:border-[2px] p-4 text-gray-500 text-center">
        No transactions available for {bank}.
      </div>
    );
  }

  return (
    <div className="my-6 border rounded shadow dark:border-neutral-500 dark:border-[2px]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-2 font-bold text-lg"
      >
        <span>{bank}</span>
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden px-4 pb-4"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Transaction Narration</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {txns.map((txn, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{txn?.[2] ?? "-"}</TableCell>
                    <TableCell>{txn?.[1] ?? "-"}</TableCell>
                    <TableCell>{typeMap[txn?.[3]] ?? "-"}</TableCell>
                    <TableCell>{txn?.[4] ?? "-"}</TableCell>
                    <TableCell className="text-right">{txn?.[0] ?? "-"}</TableCell>
                    <TableCell className="text-right">{txn?.[5] ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5}>Total Balance</TableCell>
                  <TableCell className="text-right">
                    {getTotalBalance(txns)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
