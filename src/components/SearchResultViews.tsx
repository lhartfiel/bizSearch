import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableCells } from "@fortawesome/free-solid-svg-icons";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";

const SearchResultViews = ({
  handleViewChange,
  view,
}: {
  handleViewChange: (value: string) => void;
  view: string;
}) => {
  const views = [
    {
      type: "card",
      icon: faGripVertical,
      customClass: "mr-3",
    },
    {
      type: "table",
      icon: faTableCells,
    },
  ];

  return (
    <span className="col-start-1 col-span-12 md:col-start-2 md:col-span-10 lg:col-span-9 lg:col-start-2 flex flex-nowrap justify-end w-full pr-3 mb-3">
      {views.map((vw) => {
        return (
          <button
            type="button"
            aria-label={`{vw.type} view`}
            onClick={() => handleViewChange(vw.type)}
            role="button"
            className={`${view === vw.type ? "bg-bright-salmon" : "bg-salmon/20 dark:bg-salmon/40 hover:shadow-md"} cursor-pointer p-2 rounded-sm w-[60px] ${vw.customClass}`}
          >
            <FontAwesomeIcon
              icon={vw.icon}
              className={`${view === vw.type ? "text-white" : "text-bright-salmon"} text-h2 px-2 `}
            />
          </button>
        );
      })}
    </span>
  );
};

export { SearchResultViews };
