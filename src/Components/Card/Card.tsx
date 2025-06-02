import React, { SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import "./Card.css";
import { CompanySearch } from "../../company";
import AddPortfolio from "../Portfolio/AddPortfolio/AddPortfolio";

interface Props {
  id: string;
  searchResult: CompanySearch;
  onPortfolioCreate: (e: SyntheticEvent) => void;
}

const Card: React.FC<Props> = ({ id, searchResult, onPortfolioCreate }) => {
  return (
    <div
      id={id}
      className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-6 mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="flex-1 text-center md:text-left">
        <Link
          to={`/company/${searchResult.symbol}/company-profile`}
          className="text-xl font-semibold text-indigo-700 hover:no-underline transition cursor-pointer"
        >
          {searchResult.name} ({searchResult.symbol})
        </Link>
        <p className="text-sm text-gray-600 mt-1">
          {searchResult.exchangeShortName} — {searchResult.stockExchange}
        </p>
      </div>

      <div className="text-center md:text-right">
        <p className="text-sm text-gray-500">Currency</p>
        <p className="text-lg font-medium text-gray-800">{searchResult.currency}</p>
      </div>

      <AddPortfolio
        onPortfolioCreate={onPortfolioCreate}
        symbol={searchResult.symbol}
      />
    </div>
  );
};

export default Card;
