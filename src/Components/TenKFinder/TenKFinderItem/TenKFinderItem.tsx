import React from "react";
import { Link } from "react-router-dom";
import { CompanyTenK } from "../../../company";

type Props = {
  tenK: CompanyTenK;
};

const TenKFinderItem = ({ tenK }: Props) => {
  const fillingDate = new Date(tenK.fillingDate).getFullYear();
  return (
    <Link
      reloadDocument
      to={tenK.finalLink}
      type="button"
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#0E4CAF] border border-gray-200 rounded-lg hover:bg-[#83a6db] hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
    >
      {tenK.symbol} - {fillingDate}
    </Link>
  );
};

export default TenKFinderItem;
