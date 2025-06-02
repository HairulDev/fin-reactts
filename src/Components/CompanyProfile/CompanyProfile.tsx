import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { CompanyKeyMetrics } from "../../company";
import { getKeyMetrics } from "../../api";
import RatioList from "../RatioList/RatioList";
import Spinner from "../Spinners/Spinner";
import {
  formatLargeNonMonetaryNumber,
  formatRatio,
} from "../../Helpers/NumberFormatting";
import StockComment from "../StockComment/StockComment";
import { loadCacheFromLocalStorage, saveCacheToLocalStorage } from "../../Helpers/Cache";
import { CACHE_EXPIRE_TIME } from "../../Constants/const";


const tableConfig = [
  {
    label: "Market Cap",
    render: (company: CompanyKeyMetrics) =>
      formatLargeNonMonetaryNumber(company.marketCapTTM),
    subTitle: "Total value of all a company's shares of stock",
  },
  {
    label: "Current Ratio",
    render: (company: CompanyKeyMetrics) =>
      formatRatio(company.currentRatioTTM),
    subTitle: "Measures the company's ability to pay short term debt obligations",
  },
  {
    label: "Return On Equity",
    render: (company: CompanyKeyMetrics) => formatRatio(company.roeTTM),
    subTitle: "Return on equity is the company's net income divided by shareholder's equity",
  },
  {
    label: "Return On Assets",
    render: (company: CompanyKeyMetrics) =>
      formatRatio(company.returnOnTangibleAssetsTTM),
    subTitle: "Measures how effective a company is using its assets",
  },
  {
    label: "Free Cashflow Per Share",
    render: (company: CompanyKeyMetrics) =>
      formatRatio(company.freeCashFlowPerShareTTM),
    subTitle: "Cash flow available after capital expenditures, per share",
  },
  {
    label: "Book Value Per Share TTM",
    render: (company: CompanyKeyMetrics) =>
      formatRatio(company.bookValuePerShareTTM),
    subTitle: "Firm's net asset value (assets - liabilities) per share",
  },
  {
    label: "Dividend Yield TTM",
    render: (company: CompanyKeyMetrics) =>
      formatRatio(company.dividendYieldTTM),
    subTitle: "Amount a company pays each year relative to its stock price",
  },
  {
    label: "Capex Per Share TTM",
    render: (company: CompanyKeyMetrics) =>
      formatRatio(company.capexPerShareTTM),
    subTitle: "Capital expenditures spent to maintain/upgrade assets per share",
  },
  {
    label: "Graham Number",
    render: (company: CompanyKeyMetrics) =>
      formatRatio(company.grahamNumberTTM),
    subTitle: "Upper bound of a stock's fair price for defensive investors",
  },
  {
    label: "PE Ratio",
    render: (company: CompanyKeyMetrics) => formatRatio(company.peRatioTTM),
    subTitle: "Price-to-earnings ratio (valuation metric)",
  },
];


const CompanyProfile = () => {
  const ticker = useOutletContext<string>();
  const [companyData, setCompanyData] = useState<CompanyKeyMetrics>();

  useEffect(() => {
    const loadedCache = loadCacheFromLocalStorage<CompanyKeyMetrics>("keyMetricsCache");

    const getCompanyKeyRatios = async () => {
      const cached = loadedCache[ticker];
      const now = Date.now();

      if (cached && now - cached.timestamp < CACHE_EXPIRE_TIME) {
        setCompanyData(cached.data);
        return;
      }

      const result = await getKeyMetrics(ticker);
      if (result?.data && result.data.length > 0) {
        const fetchedData = result.data[0];
        setCompanyData(fetchedData);

        const updatedCache = {
          ...loadedCache,
          [ticker]: {
            data: fetchedData,
            timestamp: now,
          },
        };

        saveCacheToLocalStorage("keyMetricsCache", updatedCache);
      }
    };

    getCompanyKeyRatios();
  }, [ticker]);

  return (
    <>
      {companyData ? (
        <>
          <RatioList config={tableConfig} data={companyData} />
          <StockComment stockSymbol={ticker} />
        </>
      ) : (
        <div className="flex justify-center items-center p-4">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default CompanyProfile;