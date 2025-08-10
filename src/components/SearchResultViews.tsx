import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { faTableCells } from "@fortawesome/free-solid-svg-icons";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";

const tableIcon = (
  <FontAwesomeIcon
    icon={faTableCells}
    className="text-h2 px-2 text-bright-salmon"
  />
);
const cardIcon = (
  <FontAwesomeIcon
    icon={faGripVertical}
    className="text-h2 px-2 text-bright-salmon"
  />
);

const SearchResultViews = ({
  handleViewChange,
}: {
  handleViewChange: (value: string) => void;
}) => {
  return (
    <span className="col-start-1 col-span-12 md:col-start-2 md:col-span-10 lg:col-span-9 lg:col-start-2 flex flex-nowrap justify-end w-full pr-3 mb-3">
      <button
        onClick={() => handleViewChange("card")}
        role="button"
        className="cursor-pointer p-2 rounded-sm w-[60px] bg-salmon/30 mr-3"
      >
        {cardIcon}
      </button>
      <button
        onClick={() => handleViewChange("table")}
        role="button"
        className="cursor-pointer p-2 bg-salmon/30 rounded-sm w-[60px]"
      >
        {tableIcon}
      </button>
    </span>
  );
};

export { SearchResultViews };
