import React, { ChangeEvent, SyntheticEvent } from "react";

interface Props {
  onSearchSubmit: (e: SyntheticEvent) => void;
  search: string | undefined;
  handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Search: React.FC<Props> = ({
  onSearchSubmit,
  search,
  handleSearchChange,
}: Props): JSX.Element => {
  return (
    <section className="bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        <form
          onSubmit={onSearchSubmit}
          autoComplete="off"
          className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl shadow-md border border-gray-200"
        >
          <input
            id="search-input"
            type="text"
            placeholder="🔍 Search companies..."
            value={search}
            onChange={handleSearchChange}
            className="flex-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
};

export default Search;
