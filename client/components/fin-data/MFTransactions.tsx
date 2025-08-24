"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
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

type Transaction = [number?, string?, number?, number?, number?];

type Scheme = {
  isin?: string;
  schemeName?: string;
  folioId?: string;
  txns?: Transaction[];
};

async function fetchMFReport(phone: string) {
  const res = await fetch(
    `http://localhost:5000/fetch_mf_transactions/${phone}`
  );
  if (!res.ok) throw new Error("Failed to fetch Mutual Fund report");
  return res.json();
}

const MFTransactions = ({ phone }: { phone: string }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["mfReport", phone],
    queryFn: () => fetchMFReport(phone),
    enabled: !!phone,
  });

  if (isLoading)
    return (
      <div className="grid place-items-center h-full text-xl font-bold">
        Loading Mutual Fund report...
      </div>
    );

  if (isError)
    return <div>Error: {(error as Error)?.message ?? "Unknown error"}</div>;

  const mfTransactions: Scheme[] = data?.mfTransactions ?? [];
  if (!mfTransactions.length)
    return (
      <div className="p-6 text-center text-gray-500">
        No Mutual Fund transactions available
      </div>
    );

  return (
    <div className="p-4 space-y-6">
      <h1 className="font-bold text-xl underline underline-offset-2">
        Mutual Fund Report
      </h1>
      {mfTransactions.map((scheme, idx) => (
        <SchemeCard key={idx} scheme={scheme} />
      ))}
    </div>
  );
};

export default MFTransactions;

function SchemeCard({ scheme }: { scheme: Scheme }) {
  const [expanded, setExpanded] = useState(false);
  const txns = scheme.txns ?? [];
  const { invested, units } = calculateSummary(txns);
  const latestNav = txns.at(-1)?.[2] ?? 0;
  const currentValue = units * latestNav;

  return (
    <div className="border p-4 rounded shadow dark:border-neutral-500 dark:border-[2px]">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg">{scheme.schemeName ?? "-"}</h2>
          <div className="text-sm text-neutral-600">
            Folio: {scheme.folioId ?? "-"}
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 bg-gray-300 rounded-xl hover:cursor-pointer hover:bg-gray-400"
        >
          <motion.div
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.div>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden space-y-4 mt-4"
          >
            <div>
              <h3 className="font-semibold mb-2">Summary</h3>
              <ul className="list-disc ml-6">
                <li>Total Invested: ₹{invested.toFixed(2)}</li>
                <li>Total Units: {units.toFixed(2)}</li>
                <li>Current Value: ₹{currentValue.toFixed(2)}</li>
                <li>XIRR: (to be implemented)</li>
              </ul>
            </div>
            <TransactionTable txns={txns} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TransactionTable({ txns }: { txns: Transaction[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">NAV</TableHead>
          <TableHead className="text-right">Units</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {txns.map((txn, idx) => (
          <TableRow key={idx}>
            <TableCell>{txn?.[1] ?? "-"}</TableCell>
            <TableCell className="text-right">{txn?.[2] ?? 0}</TableCell>
            <TableCell className="text-right">{txn?.[3] ?? 0}</TableCell>
            <TableCell className="text-right">{txn?.[4] ?? 0}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">
            ₹{txns.reduce((sum, t) => sum + (t?.[4] ?? 0), 0).toFixed(2)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

function calculateSummary(txns: Transaction[]) {
  let invested = 0;
  let units = 0;
  for (const [, , , u = 0, amt = 0] of txns) {
    invested += amt;
    units += u;
  }
  return { invested, units };
}
