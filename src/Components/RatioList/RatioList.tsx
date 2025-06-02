type Props = {
  config: any;
  data: any;
};

const RatioList = ({ config, data }: Props) => {
  const renderedCells = config.map((row: any, index: number) => {
    const isEven = index % 2 === 0;
    const bgColor = isEven ? "bg-white" : "bg-gray-100";

    return (
      <li key={index} className={`${bgColor} py-2 sm:py-3 px-2 sm:px-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm md:text-base font-medium font-semibold">
              {row.label}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              {row.subTitle && row.subTitle}
            </div>
          </div>
          <div className="inline-flex items-center text-sm sm:text-base md:text-lg font-semibold text-gray-900">
            {row.render(data)}
          </div>
        </div>
      </li>
    );
  });

  return (
    <div className="bg-white shadow rounded-m ml-2 sm:m-4 mt-4 mb-4 p-3 sm:p-0 w-full">
      <ul className="divide-y divide-gray-200">{renderedCells}</ul>
    </div>
  );
};

export default RatioList;
