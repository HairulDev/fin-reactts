import React, { useState, ChangeEvent, SyntheticEvent, useEffect } from "react";
import { CompanySearch } from "../../company";
import { searchCompanies } from "../../api";
import Search from "../../Components/Search/Search";
import ListPortfolio from "../../Components/Portfolio/ListPortfolio/ListPortfolio";
import CardList from "../../Components/CardList/CardList";
import { PortfolioGet } from "../../Models/Portfolio";
import {
  portfolioAddAPI,
  portfolioDeleteAPI,
  portfolioGetAPI,
} from "../../Services/PortfolioService";
import { toast } from "react-toastify";
import { loadCacheFromLocalStorage, saveCacheToLocalStorage } from "../../Helpers/Cache";
import { CACHE_EXPIRE_TIME } from "../../Constants/const";


const SearchPage = () => {
  const [search, setSearch] = useState<string>("");
  const [portfolioValues, setPortfolioValues] = useState<PortfolioGet[] | null>([]);
  const [searchResult, setSearchResult] = useState<CompanySearch[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [searchCache, setSearchCache] = useState<{ [query: string]: { data: CompanySearch[], timestamp: number } }>({});

  useEffect(() => {
    const initialCache = loadCacheFromLocalStorage<CompanySearch[]>("searchCache");
    setSearchCache(initialCache);
    getPortfolio();
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const getPortfolio = () => {
    portfolioGetAPI()
      .then((res) => {
        if (res?.data) {
          setPortfolioValues(res?.data);
        }
      })
      .catch(() => {
        setPortfolioValues(null);
      });
  };

  const onPortfolioCreate = (e: any) => {
    e.preventDefault();
    portfolioAddAPI(e.target[0].value)
      .then((res) => {
        if (res?.status === 204) {
          toast.success("Stock added to portfolio!");
          getPortfolio();
        }
      })
      .catch(() => {
        toast.warning("Could not add stock to portfolio!");
      });
  };

  const onPortfolioDelete = (e: any) => {
    e.preventDefault();
    portfolioDeleteAPI(e.target[0].value).then((res) => {
      if (res?.status === 200) {
        toast.success("Stock deleted from portfolio!");
        getPortfolio();
      }
    });
  };

  const onSearchSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const cached = searchCache[search];
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_EXPIRE_TIME) {
      // Jika cache masih valid
      setSearchResult(cached.data);
      return;
    }

    const result = await searchCompanies(search);

    if (typeof result === "string") {
      setServerError(result);
    } else if (Array.isArray(result.data)) {
      setSearchResult(result.data);

      const updatedCache = {
        ...searchCache,
        [search]: {
          data: result.data,
          timestamp: now,
        },
      };

      setSearchCache(updatedCache);
      saveCacheToLocalStorage("searchCache", updatedCache);
    }
  };

  return (
    <>
      <Search
        onSearchSubmit={onSearchSubmit}
        search={search}
        handleSearchChange={handleSearchChange}
      />
      <ListPortfolio
        portfolioValues={portfolioValues!}
        onPortfolioDelete={onPortfolioDelete}
      />
      <CardList
        searchResults={searchResult}
        onPortfolioCreate={onPortfolioCreate}
      />
      {serverError && <div className="text-red-500 text-center mt-4">Unable to connect to API</div>}
    </>
  );
};

export default SearchPage;
