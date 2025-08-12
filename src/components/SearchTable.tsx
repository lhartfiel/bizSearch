import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  useReactTable,
} from "@tanstack/react-table";
import { useState, useReducer } from "react";
import { searchResultPlacesType } from "../helpers/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { Ratings } from "./Ratings";
import { InfoBox } from "./InfoBox";
import parsePhoneNumber, { parse } from "libphonenumber-js";
import { useEffect } from "react";

const webIcon = (
  <FontAwesomeIcon icon={faGlobe} className="text-h2 text-bright-salmon" />
);

const columnHelper = createColumnHelper<searchResultPlacesType>();

const isTouchDevice = () => {
  return typeof window !== "undefined" && "ontouchstart" in window;
};
const defaultColumns: ColumnDef<searchResultPlacesType>[] = [
  columnHelper.group({
    id: "search",
    columns: [
      columnHelper.accessor((row) => row?.name, {
        id: "name",
        cell: (info) => info.getValue(),
        header: () => <span>Name</span>,
        size: 200,
        minSize: 150,
      }),
      columnHelper.accessor((row) => row.address, {
        id: "address",
        cell: (info) => info.getValue(),
        header: () => <span>Address</span>,
        size: 200,
        minSize: 150,
      }),
      columnHelper.accessor((row) => row.phone, {
        id: "phone",
        cell: (info) => {
          const phoneNumber = info.getValue()
            ? parsePhoneNumber(info.getValue(), "US")
            : "";
          const formattedPhone = phoneNumber
            ? phoneNumber.formatNational()
            : "–";
          return formattedPhone;
        },
        header: () => <span>Phone</span>,
        minSize: 150,
        size: 200,
      }),
      columnHelper.accessor((row) => row.rating, {
        id: "rating",
        cell: (info) => {
          if (!info.getValue()) return "–";
          {
            return (
              <span className="relative flex justify-center items-center w-full mt-2 z-10">
                <Ratings rating={info.getValue()} />
                <InfoBox
                  isTouch={isTouchDevice()}
                  rating={info.getValue()}
                  ratingCount={info.row.original?.ratingCount}
                  showHover={false}
                />
              </span>
            );
          }
        },
        header: () => <span>Rating</span>,
        size: 150,
      }),
      columnHelper.accessor((row) => row.webUrl, {
        id: "url",
        cell: (info) =>
          info.getValue() && isTouchDevice() ? (
            <a href={info.getValue()} target="_blank">
              {webIcon}
            </a>
          ) : info.getValue() ? (
            webIcon
          ) : (
            "–"
          ),
        header: () => <span>Url</span>,
        size: 100,
      }),
    ],
  }),
];

const SearchTable = ({ result }: { result: searchResultPlacesType[] }) => {
  const [data, _setData] = useState(() => [...result]);
  const [columns] = useState<typeof defaultColumns>(() => [...defaultColumns]);

  useEffect(() => {
    _setData([...result]);
  }, [result]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
  });

  return (
    <div className="col-start-1 col-span-12 md:col-start-2 md:col-span-10 lg:col-start-2 p-2 w-full max-w-full pt-4 overflow-y-auto overflow-x-auto">
      <table className="shadow-card bg-white w-full rounded-[8px] overflow-hidden table-fixed md:table-auto">
        <thead>
          {table.getHeaderGroups().map(
            (headerGroup, idx) =>
              idx !== 0 && (
                <tr
                  key={headerGroup.id}
                  className="bg-gray-300 shadow-sm uppercase"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                      className="font-semibold text-[16px] py-3"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ),
          )}
        </thead>
        <tbody className="w-full overflow-x-auto">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              tabIndex={0}
              onClick={() =>
                !isTouchDevice() && window.open(row.getValue("url"))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  !isTouchDevice() && window.open(row.getValue("url"));
                }
              }}
              className={`border-1 border-gray-200 bg-transparent transition duration-300 ${row.getValue("url") && "hover:cursor-pointer hover:font-semibold hover:shadow-md hover:bg-salmon/15 "}`}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  {...{
                    style: {
                      padding: "12px",
                      width: cell.column.getSize(),
                    },
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className={`${header.isPlaceholder} ? '' : 'py-2'`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="h-4" />
    </div>
  );
};

export { SearchTable };
