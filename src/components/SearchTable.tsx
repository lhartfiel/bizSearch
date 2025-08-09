import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState, useReducer } from "react";
import { searchResultPlacesType } from "../helpers/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

const webIcon = (
  <FontAwesomeIcon icon={faGlobe} className="text-h2 text-bright-salmon" />
);

const columnHelper = createColumnHelper<searchResultPlacesType>();

const columns = [
  columnHelper.group({
    id: "search",
    header: () => <span>Search Results</span>,
    // footer: props => props.column.id,
    columns: [
      columnHelper.accessor((row) => row?.name, {
        id: "name",
        cell: (info) => info.getValue(),
        header: () => <span>Name</span>,
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.address, {
        id: "address",
        cell: (info) => info.getValue(),
        header: () => <span>Address</span>,
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.phone, {
        id: "phone",
        cell: (info) => info.getValue(),
        header: () => <span>Phone</span>,
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.rating, {
        id: "rating",
        cell: (info) => info.getValue(),
        header: () => <span>Rating</span>,
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.webUrl, {
        id: "url",
        cell: (info) =>
          info.getValue() ? <a href={info.getValue()}>{webIcon}</a> : "–",
        header: () => <span>Url</span>,
        footer: (props) => props.column.id,
      }),
    ],
  }),
];

const SearchTable = ({ result }) => {
  console.log(result);
  const [data, _setData] = useState(() => [...result]);
  const rerender = useReducer(() => ({}), {})[1];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="bg-white col-start-1 col-span-12 md:col-start-2 md:col-span-10 lg:col-start-2 p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
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
                <th key={header.id} colSpan={header.colSpan}>
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
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
    </div>
  );
};

export { SearchTable };
