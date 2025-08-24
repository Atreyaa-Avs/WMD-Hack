"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Value = { currencyCode: string; units: string | number };
type Asset = { netWorthAttribute: string; value: Value };
type NetWorthResponse = {
  assetValues: Asset[];
  totalNetWorthValue: Value;
};

type SchemeAnalytics = {
  schemeDetail: {
    amc: string;
    nameData: { longName: string };
    isinNumber: string;
    categoryName: string;
  };
  enrichedAnalytics: {
    analytics: {
      schemeDetails: {
        currentValue: Value;
        investedValue: Value;
        XIRR?: number;
        unrealisedReturns: Value;
        realisedReturns?: Value;
        units: number;
      };
    };
  };
};

type AccountMap = {
  [uuid: string]: any;
};

type NetWorthData = {
  netWorthResponse?: NetWorthResponse;
  mfSchemeAnalytics?: { schemeAnalytics?: SchemeAnalytics[] };
  accountDetailsBulkResponse?: { accountDetailsMap?: AccountMap };
};

async function fetchNetWorth(phone: string) {
  const res = await fetch(`http://localhost:5000/fetch_net_worth/${phone}`);
  if (!res.ok) throw new Error("Failed to fetch Net Worth data");
  return res.json() as Promise<NetWorthData>;
}

export default function NetWorthDashboard({ phone }: { phone: string }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["netWorth", phone],
    queryFn: () => fetchNetWorth(phone),
    enabled: !!phone,
  });

  if (isLoading) return <div>Loading Net Worth data...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  // Safe fallback if response is empty
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No Net Worth data available for this user.
      </div>
    );
  }

  const netWorthResponse = data.netWorthResponse;
  const mfSchemeAnalytics = data.mfSchemeAnalytics?.schemeAnalytics ?? [];
  const accountMap = data.accountDetailsBulkResponse?.accountDetailsMap ?? {};

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold underline underline-offset-2">
        Net Worth Dashboard
      </h1>

      {/* Net Worth Summary */}
      <div className="border p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Total Net Worth</h2>
        <div className="text-xl font-bold">
          ₹{Number(netWorthResponse?.totalNetWorthValue?.units ?? 0).toLocaleString()}
        </div>
      </div>

      {/* Asset Classes */}
      <div className="border p-4 rounded shadow space-y-3">
        <h2 className="text-lg font-semibold mb-2">Assets & Liabilities</h2>
        {netWorthResponse?.assetValues?.map((a, idx) => (
          <div
            key={idx}
            className="flex justify-between border-b py-1 text-sm last:border-0"
          >
            <span>{a.netWorthAttribute?.replace(/ASSET_TYPE_|LIABILITY_TYPE_/, "")}</span>
            <span>₹{Number(a.value?.units ?? 0).toLocaleString()}</span>
          </div>
        )) ?? <div className="text-gray-500">No asset data available.</div>}
      </div>

      {/* Mutual Fund Schemes */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Mutual Fund Schemes</h2>
        {mfSchemeAnalytics.length > 0 ? (
          mfSchemeAnalytics.map((s, idx) => (
            <ExpandableCard
              key={idx}
              title={s.schemeDetail?.nameData?.longName ?? "Unnamed Scheme"}
              subtitle={`${s.schemeDetail?.categoryName ?? "-"} (${s.schemeDetail?.amc ?? "-"})`}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invested</TableHead>
                    <TableHead>Current</TableHead>
                    <TableHead>Returns</TableHead>
                    <TableHead>XIRR</TableHead>
                    <TableHead>Units</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      ₹
                      {Number(
                        s.enrichedAnalytics?.analytics?.schemeDetails?.investedValue?.units ?? 0
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      ₹
                      {Number(
                        s.enrichedAnalytics?.analytics?.schemeDetails?.currentValue?.units ?? 0
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      ₹
                      {Number(
                        s.enrichedAnalytics?.analytics?.schemeDetails?.unrealisedReturns?.units ?? 0
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {s.enrichedAnalytics?.analytics?.schemeDetails?.XIRR ?? "-"}%
                    </TableCell>
                    <TableCell>
                      {s.enrichedAnalytics?.analytics?.schemeDetails?.units ?? "-"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ExpandableCard>
          ))
        ) : (
          <div className="text-gray-500">No mutual fund schemes available.</div>
        )}
      </div>

      {/* Accounts */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Accounts</h2>
        {Object.entries(accountMap).length > 0 ? (
          Object.entries(accountMap).map(([uuid, acc]) => (
            <ExpandableCard
              key={uuid}
              title={acc?.accountDetails?.maskedAccountNumber ?? "Unknown Account"}
              subtitle={acc?.accountDetails?.accInstrumentType ?? "-"}
            >
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(acc, null, 2)}
              </pre>
            </ExpandableCard>
          ))
        ) : (
          <div className="text-gray-500">No accounts available.</div>
        )}
      </div>
    </div>
  );
}

function ExpandableCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border p-3 rounded shadow">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-bold">{title}</div>
          {subtitle && <div className="text-sm text-neutral-600">{subtitle}</div>}
        </div>
        <button onClick={() => setOpen(!open)}>
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.div>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
