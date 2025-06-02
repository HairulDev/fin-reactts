type Props = {
  config: any;
  data: any;
};

const Table = ({ config, data }: Props) => {
  const renderedRows = data.map((company: any, index: number) => {
    return (
      <tr key={index} className="border-b last:border-none">
        {config.map((val: any, idx: number) => (
          <td
            key={idx}
            className="p-2 text-xs sm:text-sm text-gray-700 whitespace-nowrap"
          >
            {val.render(company)}
          </td>
        ))}
      </tr>
    );
  });

  const renderedHeaders = config.map((config: any, index: number) => {
    return (
      <th
        key={index}
        className="p-2 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
      >
        {config.label}
      </th>
    );
  });

  return (
    <div className="w-full m-4 overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="shadow-md overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 text-gray-900">
            <thead className="bg-gray-50">
              <tr>{renderedHeaders}</tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {renderedRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;
