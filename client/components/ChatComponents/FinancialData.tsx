"use client";

import React from "react";
import { useProfile } from "@/store/useProfile";
import BankTransactions from "../fin-data/BankTransactions";
import TableComponent from "../TableComponent";
import CreditCardReport from "../fin-data/CreditCardReport";
import EPFReport from "../fin-data/EPFDetails";
import MFTransactions from "../fin-data/MFTransactions";
import NetWorthDashboard from "../fin-data/NetWorth";
import StockTransactions from "../fin-data/StockTransactions";

const FinancialData = () => {
  const { phone } = useProfile();

  if (!phone) return <div>Please set your phone number.</div>;

  return (
    <div className="mb-36">
      <BankTransactions phone={phone} />
      <CreditCardReport phone={phone} />
      <EPFReport phone={phone} />
      <MFTransactions phone={phone} />
      <NetWorthDashboard phone={phone} />
      <StockTransactions phone={phone} />
    </div>
  );
};

export default FinancialData;
