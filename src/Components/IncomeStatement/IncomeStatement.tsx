import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Table from "../Table/Table";
import { CompanyIncomeStatement } from "../../company";
import { getIncomeStatement } from "../../api";
import Spinner from "../Spinners/Spinner";
import {
  formatLargeMonetaryNumber,
  formatRatio,
} from "../../Helpers/NumberFormatting";
import { loadCacheFromLocalStorage, saveCacheToLocalStorage } from "../../Helpers/Cache";
import { CACHE_EXPIRE_TIME } from "../../Constants/const";


const configs = [
  {
    label: "Date",
    render: (company: CompanyIncomeStatement) => company.date,
  },
  {
    label: "Revenue",
    render: (company: CompanyIncomeStatement) =>
      formatLargeMonetaryNumber(company.revenue),
  },
  {
    label: "Cost Of Revenue",
    render: (company: CompanyIncomeStatement) =>
      formatLargeMonetaryNumber(company.costOfRevenue),
  },
  {
    label: "Deprec",
    render: (company: CompanyIncomeStatement) =>
      formatLargeMonetaryNumber(company.depreciationAndAmortization),
  },
  {
    label: "Operating Income",
    render: (company: CompanyIncomeStatement) =>
      formatLargeMonetaryNumber(company.operatingIncome),
  },
  {
    label: "Income Before Taxes",
    render: (company: CompanyIncomeStatement) =>
      formatLargeMonetaryNumber(company.incomeBeforeTax),
  },
  {
    label: "Net Income",
    render: (company: CompanyIncomeStatement) =>
      formatLargeMonetaryNumber(company.netIncome),
  },
  {
    label: "Net Income Ratio",
    render: (company: CompanyIncomeStatement) =>
      formatRatio(company.netIncomeRatio),
  },
  {
    label: "Earnings Per Share",
    render: (company: CompanyIncomeStatement) => formatRatio(company.eps),
  },
  {
    label: "Earnings Per Diluted",
    render: (company: CompanyIncomeStatement) =>
      formatRatio(company.epsdiluted),
  },
  {
    label: "Gross Profit Ratio",
    render: (company: CompanyIncomeStatement) =>
      formatRatio(company.grossProfitRatio),
  },
  {
    label: "Operating Income Ratio",
    render: (company: CompanyIncomeStatement) =>
      formatRatio(company.operatingIncomeRatio),
  },
  {
    label: "Income Before Taxes Ratio",
    render: (company: CompanyIncomeStatement) =>
      formatRatio(company.incomeBeforeTaxRatio),
  },
];

const IncomeStatement = () => {
  const ticker = useOutletContext<string>();
  const [incomeStatement, setIncomeStatement] = useState<CompanyIncomeStatement[]>();

  useEffect(() => {
    const loadedCache = loadCacheFromLocalStorage<CompanyIncomeStatement[]>("incomeStatementCache");

    const getRatios = async () => {
      const cached = loadedCache[ticker];
      const now = Date.now();

      if (cached && now - cached.timestamp < CACHE_EXPIRE_TIME) {
        setIncomeStatement(cached.data);
        return;
      }

      const result = await getIncomeStatement(ticker);
      if (result?.data) {
        setIncomeStatement(result.data);

        const updatedCache = {
          ...loadedCache,
          [ticker]: {
            data: result.data,
            timestamp: now,
          },
        };

        saveCacheToLocalStorage("incomeStatementCache", updatedCache);
      }
    };

    getRatios();
  }, [ticker]);

  return (
    <>
      {incomeStatement ? (
        <Table config={configs} data={incomeStatement} />
      ) : (
        <div className="flex justify-center items-center p-4">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default IncomeStatement;
