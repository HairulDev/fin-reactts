import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { CompanyCashFlow } from "../../company";
import { getCashFlow } from "../../api";
import Table from "../Table/Table";
import Spinner from "../Spinners/Spinner";
import { formatLargeMonetaryNumber } from "../../Helpers/NumberFormatting";
import { loadCacheFromLocalStorage, saveCacheToLocalStorage } from "../../Helpers/Cache";
import { CACHE_EXPIRE_TIME } from "../../Constants/const";

const config = [
  {
    label: "Date",
    render: (company: CompanyCashFlow) => company.date,
  },
  {
    label: "Operating Cashflow",
    render: (company: CompanyCashFlow) =>
      formatLargeMonetaryNumber(company.operatingCashFlow),
  },
  {
    label: "Investing Cashflow",
    render: (company: CompanyCashFlow) =>
      formatLargeMonetaryNumber(company.netCashUsedForInvestingActivites),
  },
  {
    label: "Financing Cashflow",
    render: (company: CompanyCashFlow) =>
      formatLargeMonetaryNumber(company.netCashUsedProvidedByFinancingActivities),
  },
  {
    label: "Cash At End of Period",
    render: (company: CompanyCashFlow) =>
      formatLargeMonetaryNumber(company.cashAtEndOfPeriod),
  },
  {
    label: "CapEX",
    render: (company: CompanyCashFlow) =>
      formatLargeMonetaryNumber(company.capitalExpenditure),
  },
  {
    label: "Issuance Of Stock",
    render: (company: CompanyCashFlow) =>
      formatLargeMonetaryNumber(company.commonStockIssued),
  },
  {
    label: "Free Cash Flow",
    render: (company: CompanyCashFlow) =>
      formatLargeMonetaryNumber(company.freeCashFlow),
  },
];

const CashflowStatement = () => {
  const ticker = useOutletContext<string>();
  const [cashFlowData, setCashFlowData] = useState<CompanyCashFlow[]>();

  useEffect(() => {
    const loadedCache = loadCacheFromLocalStorage<CompanyCashFlow[]>("cashFlowCache");

    const fetchCashFlowData = async () => {
      const cached = loadedCache[ticker];
      const now = Date.now();

      if (cached && now - cached.timestamp < CACHE_EXPIRE_TIME) {
        setCashFlowData(cached.data);
        return;
      }

      const result = await getCashFlow(ticker);
      if (result?.data && result.data.length > 0) {
        setCashFlowData(result.data);

        const updatedCache = {
          ...loadedCache,
          [ticker]: {
            data: result.data,
            timestamp: now,
          },
        };

        saveCacheToLocalStorage("cashFlowCache", updatedCache);
      }
    };

    fetchCashFlowData();
  }, [ticker]);

  return cashFlowData ? (
    <Table config={config} data={cashFlowData} />
  ) : (
    <div className="flex justify-center items-center p-4">
      <Spinner />
    </div>
  );
};

export default CashflowStatement;
