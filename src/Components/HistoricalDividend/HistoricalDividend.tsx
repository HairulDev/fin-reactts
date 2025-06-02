import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getHistoricalDividend } from "../../api";
import Spinner from "../Spinners/Spinner";
import SimpleLineChart from "../SimpleLineChart/SimpleLineChart";
import { Dividend } from "../../company";
import { loadCacheFromLocalStorage, saveCacheToLocalStorage } from "../../Helpers/Cache";
import { CACHE_EXPIRE_TIME } from "../../Constants/const";

const HistoricalDividend = () => {
  const ticker = useOutletContext<string>();
  const [dividend, setDividend] = useState<Dividend[]>();

  useEffect(() => {
    const loadedCache = loadCacheFromLocalStorage<Dividend[]>("dividendCache");

    const fetchHistoricalDividend = async () => {
      const cached = loadedCache[ticker];
      const now = Date.now();

      if (cached && now - cached.timestamp < CACHE_EXPIRE_TIME) {
        setDividend(cached.data);
        return;
      }

      const result = await getHistoricalDividend(ticker);
      if (result?.data?.historical) {
        const sortedData = result.data.historical
          .slice(0, 18)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setDividend(sortedData);

        const updatedCache = {
          ...loadedCache,
          [ticker]: {
            data: sortedData,
            timestamp: now,
          },
        };

        saveCacheToLocalStorage("dividendCache", updatedCache);
      }
    };

    fetchHistoricalDividend();
  }, [ticker]);

  if (!dividend) {
    return (
      <div className="flex justify-center items-center p-4">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {dividend.length > 0 ? (
        <SimpleLineChart data={dividend} xAxis="label" dataKey="dividend" />
      ) : (
        <h1 className="ml-3">Company does not have a dividend!</h1>
      )}
    </>
  );
};

export default HistoricalDividend;
