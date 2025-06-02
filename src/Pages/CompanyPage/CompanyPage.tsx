import React, { useEffect, useState } from "react";
import { CompanyProfile } from "../../company";
import { Link, useParams } from "react-router-dom";
import { getCompanyProfile } from "../../api";
import Sidebar from "../../Components/Sidebar/Sidebar";
import CompanyDashboard from "../../Components/CompanyDashboard/CompanyDashboard";
import Tile from "../../Components/Tile/Tile";
import Spinner from "../../Components/Spinners/Spinner";
import TenKFinder from "../../Components/TenKFinder/TenKFinder";
import { CACHE_EXPIRE_TIME } from "../../Constants/const";
import { loadCacheFromLocalStorage, saveCacheToLocalStorage } from "../../Helpers/Cache";

const CompanyPage = () => {
  let { ticker } = useParams();
  const [company, setCompany] = useState<CompanyProfile>();

  useEffect(() => {
    const loadedCache = loadCacheFromLocalStorage<CompanyProfile>("companyProfileCache");

    const getProfileInit = async () => {
      const cached = loadedCache[ticker!];
      const now = Date.now();

      if (cached && now - cached.timestamp < CACHE_EXPIRE_TIME) {
        setCompany(cached.data);
        return;
      }

      const result = await getCompanyProfile(ticker!);
      if (result?.data && result.data.length > 0) {
        const fetchedData = result.data[0];
        setCompany(fetchedData);

        const updatedCache = {
          ...loadedCache,
          [ticker!]: {
            data: fetchedData,
            timestamp: now,
          },
        };

        saveCacheToLocalStorage("companyProfileCache", updatedCache);
      }
    };

    if (ticker) {
      getProfileInit();
    }
  }, [ticker]);

  if (!company) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {company && (
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 overflow-auto p-0">
            <CompanyDashboard ticker={ticker!}>
              <Tile title="Company Name" subTitle={company.companyName} />
              <Tile title="Price" subTitle={"$" + company.price.toString()} />
              <Tile title="DCF" subTitle={"$" + company.dcf.toString()} />
              <Tile title="Sector" subTitle={company.sector} />
              <TenKFinder ticker={company.symbol} />
            </CompanyDashboard>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyPage;

