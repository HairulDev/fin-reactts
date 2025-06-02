import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaTable, FaMoneyBill } from "react-icons/fa";
import { FaTableCells } from "react-icons/fa6";
import { SlGraph } from "react-icons/sl";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

const Sidebar = () => {
  const [isMinimized, setIsMinimized] = useState(true);

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <nav className={`h-screen flex flex-col bg-white transition-all duration-300 ${isMinimized ? "w-20" : "w-64"}`}>

      {/* Toggle button */}
      <div className="flex p-2 justify-end">
        <button
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
          onClick={toggleSidebar}
        >
          {isMinimized ? <FiChevronsRight size={20} /> : <FiChevronsLeft size={20} />}
        </button>
      </div>

      <div className="flex flex-col mt-4 space-y-2 px-2">
        <Link
          to="company-profile"
          className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-md"
        >
          <FaHome color="#0E4CAF" />
          {!isMinimized && <span className="text-[#0E4CAF] font-bold text-sm">Company Profile</span>}
        </Link>

        <Link
          to="income-statement"
          className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-md"
        >
          <FaTable color="#0E4CAF" />
          {!isMinimized && <span className="text-[#0E4CAF] font-bold text-sm">Income Statement</span>}
        </Link>

        <Link
          to="cashflow-statement"
          className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-md"
        >
          <FaMoneyBill color="#0E4CAF" />
          {!isMinimized && <span className="text-[#0E4CAF] font-bold text-sm">Cashflow Statement</span>}
        </Link>

        <Link
          to="balance-sheet"
          className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-md"
        >
          <FaTableCells color="#0E4CAF" />
          {!isMinimized && <span className="text-[#0E4CAF] font-bold text-sm">Balance Sheet</span>}
        </Link>

        <Link
          to="historical-dividend"
          className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-md"
        >
          <SlGraph color="#0E4CAF" />
          {!isMinimized && <span className="text-[#0E4CAF] font-bold text-sm">Historical Dividend</span>}
        </Link>
      </div>
    </nav>
  );
};

export default Sidebar;
