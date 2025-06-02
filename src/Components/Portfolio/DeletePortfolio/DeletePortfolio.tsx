import React, { SyntheticEvent } from "react";

interface Props {
  onPortfolioDelete: (e: SyntheticEvent) => void;
  portfolioValue: string;
}

const DeletePortfolio = ({ onPortfolioDelete, portfolioValue }: Props) => {
  return (
    <form onSubmit={onPortfolioDelete} className="inline-block">
      <input type="hidden" value={portfolioValue} name="symbol" />

      <button
        type="submit"
        className="px-4 py-2 text-sm font-semibold text-white bg-red-600 border border-red-600 rounded-lg transition-colors duration-200 hover:bg-white hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        Delete
      </button>
    </form>
  );
};

export default DeletePortfolio;
