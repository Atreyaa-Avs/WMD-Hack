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

type StockTxn = [number?, string?, number?, number?]; 
// [transactionType, transactionDate, quantity, navValue?]

type StockData = {
  isin?: string;
  txns?: StockTxn[];
};

async function fetchStockTransactions(phone: string) {
  const res = await fetch(`http://localhost:5000/fetch_stock_transactions/${phone}`);
  if (!res.ok) throw new Error("Failed to fetch stock transactions");
  return res.json() as Promise<{ stockTransactions: StockData[] }>;
}

export default function StockTransactions({ phone }: { phone: string }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["stockTransactions", phone],
    queryFn: () => fetchStockTransactions(phone),
    enabled: !!phone,
  });

  if (isLoading)
    return (
      <div className="grid place-items-center h-full text-xl font-bold">
        Loading stock transactions...
      </div>
    );

  if (isError)
    return <div>Error: {(error as Error)?.message ?? "Unknown error"}</div>;

  const stockTransactions: StockData[] = data?.stockTransactions ?? [];
  if (!stockTransactions.length)
    return (
      <div className="p-6 text-center text-gray-500">
        No stock transactions available for this user.
      </div>
    );

  const typeMap: Record<number, string> = {
    1: "BUY",
    2: "SELL",
    3: "BONUS",
    4: "SPLIT",
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="font-bold text-xl underline underline-offset-2">
        Stock Transactions
      </h1>
      {stockTransactions.map((stock, idx) => (
        <StockTable
          key={idx}
          isin={stock.isin ?? "-"}
          txns={stock.txns ?? []}
          typeMap={typeMap}
        />
      ))}
    </div>
  );
}

function StockTable({
  isin,
  txns,
  typeMap,
}: {
  isin: string;
  txns: StockTxn[];
  typeMap: Record<number, string>;
}) {
  const [open, setOpen] = useState(false);

  function getTotalQuantity(rows: StockTxn[]): number {
    return rows.reduce((sum, row) => {
      const type = row?.[0] ?? 0;
      const qty = row?.[2] ?? 0;
      return type === 2 ? sum - qty : sum + qty; // SELL reduces quantity
    }, 0);
  }

  return (
    <div className="my-6 border rounded shadow dark:border-neutral-500 dark:border-[2px]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-2 font-bold text-lg"
      >
        <span>{isin}</span>
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.3 }}>
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
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">NAV Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {txns.map((txn, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{txn?.[1] ?? "-"}</TableCell>
                    <TableCell>{typeMap[txn?.[0] ?? 0] ?? "-"}</TableCell>
                    <TableCell className="text-right">{txn?.[2] ?? 0}</TableCell>
                    <TableCell className="text-right">
                      {txn?.[3] !== undefined
                        ? txn[3].toLocaleString("en-IN", { style: "currency", currency: "INR" })
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}>Total Quantity</TableCell>
                  <TableCell className="text-right">{getTotalQuantity(txns)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}