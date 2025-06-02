import React from "react";
import { Outlet } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  ticker: string;
}

const CompanyDashboard = ({ children, ticker }: Props) => {
  return (
    <div className="mx-auto w-full">
      <div>
        <div className="flex flex-wrap">{children}</div>
        <div className="flex flex-wrap">{<Outlet context={ticker} />}</div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
