import React, { useEffect, useState } from "react";
import { CompanyBalanceSheet } from "../../company";
import { useOutletContext } from "react-router-dom";
import RatioList from "../RatioList/RatioList";
import { getBalanceSheet } from "../../api";
import Spinner from "../Spinners/Spinner";
import { formatLargeMonetaryNumber } from "../../Helpers/NumberFormatting";
import { loadCacheFromLocalStorage, saveCacheToLocalStorage } from "../../Helpers/Cache";
import { CACHE_EXPIRE_TIME } from "../../Constants/const";

const config = [
  {
    label: <div className="font-bold">Total Assets</div>,
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.totalAssets),
  },
  {
    label: "Current Assets",
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.totalCurrentAssets),
  },
  {
    label: "Total Cash",
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.cashAndCashEquivalents),
  },
  {
    label: "Property & Equipment",
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.propertyPlantEquipmentNet),
  },
  {
    label: "Intangible Assets",
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.intangibleAssets),
  },
  {
    label: "Long Term Debt",
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.longTermDebt),
  },
  {
    label: "Total Debt",
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.otherCurrentLiabilities),
  },
  {
    label: <div className="font-bold">Total Liabilities</div>,
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.totalLiabilities),
  },
  {
    label: "Current Liabilities",
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.totalCurrentLiabilities),
  },
  {
    label: "Long-Term Debt",
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.longTermDebt),
  },
  {
    label: "Long-Term Income Taxes",
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.otherLiabilities),
  },
  {
    label: "Stakeholder's Equity",
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.totalStockholdersEquity),
  },
  {
    label: "Retained Earnings",
    render: (company: CompanyBalanceSheet) =>
      formatLargeMonetaryNumber(company.retainedEarnings),
  },
];

const BalanceSheet = () => {
  const ticker = useOutletContext<string>();
  const [companyData, setCompanyData] = useState<CompanyBalanceSheet>();

  useEffect(() => {
    const loadedCache = loadCacheFromLocalStorage<CompanyBalanceSheet>("balanceSheetCache");

    const getCompanyData = async () => {
      const cached = loadedCache[ticker];
      const now = Date.now();

      if (cached && now - cached.timestamp < CACHE_EXPIRE_TIME) {
        setCompanyData(cached.data);
        return;
      }

      const result = await getBalanceSheet(ticker);
      if (result?.data && result.data.length > 0) {
        const latestData = result.data[0];
        setCompanyData(latestData);

        const updatedCache = {
          ...loadedCache,
          [ticker]: {
            data: latestData,
            timestamp: now,
          },
        };

        saveCacheToLocalStorage("balanceSheetCache", updatedCache);
      }
    };

    getCompanyData();
  }, [ticker]);

  return (
    <>
      {companyData ? (
        <RatioList config={config} data={companyData} />
      ) : (
        <div className="flex justify-center items-center p-4">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default BalanceSheet;
