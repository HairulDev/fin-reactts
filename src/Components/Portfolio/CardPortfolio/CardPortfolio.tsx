import React, { SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import DeletePortfolio from "../DeletePortfolio/DeletePortfolio";
import { PortfolioGet } from "../../../Models/Portfolio";

interface Props {
  portfolioValue: PortfolioGet;
  onPortfolioDelete: (e: SyntheticEvent) => void;
}

const CardPortfolio = ({ portfolioValue, onPortfolioDelete }: Props) => {
  return (
    <div
      className="w-full md:w-1/3 p-5 bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
    >
      <Link
        to={`/company/${portfolioValue.symbol}/company-profile`}
        className="block text-2xl font-semibold text-indigo-700 hover:text-indigo-900 transition-colors"
      >
        {portfolioValue.symbol}
      </Link>

      <div className="mt-4 flex justify-center">
        <DeletePortfolio
          portfolioValue={portfolioValue.symbol}
          onPortfolioDelete={onPortfolioDelete}
        />
      </div>
    </div>
  );
};

export default CardPortfolio;
