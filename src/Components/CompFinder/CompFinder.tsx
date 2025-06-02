import React, { useEffect, useState } from "react";
import CompFinderItem from "./CompFinderItem/CompFinderItem";
import { CompanyCompData } from "../../company";
import { getCompData } from "../../api";
import Spinner from "../Spinners/Spinner";

type Props = {
  ticker: string;
};

const CACHE_EXPIRE_TIME = 60 * 60 * 1000; // 1 jam

const saveCompCache = (cache: { [ticker: string]: { data: CompanyCompData, timestamp: number } }) => {
  localStorage.setItem("compCache", JSON.stringify(cache));
};

const loadCompCache = () => {
  const cacheString = localStorage.getItem("compCache");
  if (!cacheString) return {};
  try {
    return JSON.parse(cacheString);
  } catch (error) {
    console.error("Failed to parse comp cache", error);
    return {};
  }
};

const CompFinder = ({ ticker }: Props) => {
  const [companyData, setCompanyData] = useState<CompanyCompData>();
  const [cache, setCache] = useState<{ [ticker: string]: { data: CompanyCompData, timestamp: number } }>({});

  useEffect(() => {
    const loadedCache = loadCompCache();
    setCache(loadedCache);

    const getComps = async () => {
      const cached = loadedCache[ticker];
      const now = Date.now();

      if (cached && now - cached.timestamp < CACHE_EXPIRE_TIME) {
        setCompanyData(cached.data);
        return;
      }

      const value = await getCompData(ticker);
      if (value?.data?.[0]) {
        setCompanyData(value.data[0]);

        const updatedCache = {
          ...loadedCache,
          [ticker]: {
            data: value.data[0],
            timestamp: now,
          },
        };

        setCache(updatedCache);
        saveCompCache(updatedCache);
      }
    };

    if (ticker) {
      getComps();
    }
  }, [ticker]);

  return (
    <div className="rounded-md shadow-sm mx-2" role="group">
      {companyData ? (
        companyData.peersList.map((peerTicker) => (
          <CompFinderItem key={peerTicker} ticker={peerTicker} />
        ))
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default CompFinder;
