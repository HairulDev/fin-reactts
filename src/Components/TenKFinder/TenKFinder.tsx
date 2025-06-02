import React, { useEffect, useState } from "react";
import { CompanyTenK } from "../../company";
import { getTenK } from "../../api";
import TenKFinderItem from "./TenKFinderItem/TenKFinderItem";
import Spinner from "../Spinners/Spinner";
import { CACHE_EXPIRE_TIME } from "../../Constants/const";
import { loadCacheFromLocalStorage, saveCacheToLocalStorage } from "../../Helpers/Cache";


type Props = {
  ticker: string;
};

const TenKFinder = ({ ticker }: Props) => {
  const [companyData, setCompanyData] = useState<CompanyTenK[]>();

  useEffect(() => {
    const loadedCache = loadCacheFromLocalStorage<CompanyTenK[]>("tenKCache");

    const getTenKData = async () => {
      const cached = loadedCache[ticker];
      const now = Date.now();

      if (cached && now - cached.timestamp < CACHE_EXPIRE_TIME) {
        setCompanyData(cached.data);
        return;
      }

      const value = await getTenK(ticker);
      if (value?.data) {
        setCompanyData(value.data);

        const updatedCache = {
          ...loadedCache,
          [ticker]: {
            data: value.data,
            timestamp: now,
          },
        };

        saveCacheToLocalStorage("tenKCache", updatedCache);
      }
    };

    if (ticker) {
      getTenKData();
    }
  }, [ticker]);

  return (
    <div className="flex justify-center">
      <div className="mx-4 mb-4">
        {companyData ? (
          companyData.slice(0, 5).map((tenK) => (
            <TenKFinderItem key={tenK.finalLink} tenK={tenK} />
          ))
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

export default TenKFinder;
