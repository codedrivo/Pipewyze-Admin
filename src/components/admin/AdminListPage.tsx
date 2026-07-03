import { useEffect, useMemo, useState, type ReactNode } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import LoadingSpinner from "../UI/loadingSpinner/LoadingSpinner";
import dataTable from "../tables/customTable/datatable.module.scss";

export type AdminListColumn<T> = {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  align?: "left" | "center" | "right";
};

type AdminListPageProps<T> = {
  rows: T[];
  // rows: [];
  columns: AdminListColumn<T>[];
  getRowId: (row: T) => string;
  searchKeys?: (keyof T)[];
  title?: string;
  emptyMessage?: string;
  pageSize?: number;
  loading?: boolean;
  initialSearch?: string;
  headerAction?: ReactNode;
  searchPlaceholder?: string;
};

const getCellText = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (value instanceof Date) {
    return value.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return String(value);
};

function AdminListPage<T>({
  rows,
  columns,
  getRowId,
  searchKeys,
  emptyMessage = "No data available",
  pageSize = 10,
  loading = false,
  initialSearch = "",
  headerAction,
  searchPlaceholder = "Search...",
}: AdminListPageProps<T>) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const safeRows = Array.isArray(rows) ? rows : [];

    // if (!normalizedSearch) {
    //   // return rows;
    //   return Array.isArray(rows) ? rows : [];
    // }

    if (!normalizedSearch) {
      return rows || [];
    }

    // return rows.filter((row) => {
    return safeRows.filter((row) => {
      if (!row) return false;
      const values =
        searchKeys?.length && searchKeys.length > 0
          ? searchKeys.map((key) => row[key])
          : Object.values(row as Record<string, unknown>);

      return values.some((value) =>
        getCellText(value).toLowerCase().includes(normalizedSearch)
      );
    });
  }, [rows, searchKeys, searchTerm]);

  // const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const totalPages = Math.ceil((filteredRows?.length || 0) / pageSize);
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRows = filteredRows.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  return (
    <section className='users-pages'>
      {loading ? <LoadingSpinner /> : null}
      <div className={dataTable.datatablemainwrap}>
        <div
          className={dataTable.searchwrap}
          style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "15px",
            justifyContent: "flex-start",
            position: "relative",
            marginTop: "20px",
            flexWrap: "wrap",
          }}
        >
          {headerAction ? <div>{headerAction}</div> : null}
          <input
            type='text'
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "10px",
              border: "1px solid #C5DDB8",
              maxWidth: "350px",
              height: "50px",
              width: "100%",
              marginLeft: "auto",
              flex: "1 1 350px",
            }}
          />
        </div>

        <div className='usertabledata'>
          <TableContainer className={dataTable.tbodymain} component={Paper}>
            <Table
              sx={{ minWidth: 1000 }}
              aria-label='admin list table'
              style={{ borderCollapse: "separate", borderSpacing: "0px 15px" }}
            >
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.key} align={column.align ?? "left"}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody className={dataTable.tbodywrap}>
                {/* {paginatedRows.map((row) => ( */}
                {(paginatedRows || []).map((row) => (
                  <TableRow
                    key={getRowId(row)}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={`${getRowId(row)}_${column.key}`}
                        align={column.align ?? "left"}
                      >
                        {column.render
                          ? column.render(row)
                          : getCellText(
                              (row as Record<string, unknown>)[column.key]
                            )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

                {paginatedRows.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={columns.length} align='center'>
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <Stack
          spacing={2}
          justifyContent='center'
          alignItems='center'
          style={{ marginTop: "30px" }}
        >
          <Pagination
            className='pagiWrap'
            count={totalPages}
            page={safePage}
            onChange={(_, page) => setCurrentPage(page)}
            sx={{
              ".MuiPaginationItem-page": {
                backgroundColor: "#fff",
                color: "#414141",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                "&.Mui-selected": {
                  backgroundColor: "#ff8400",
                  color: "#fff",
                },
                "&:hover": {
                  backgroundColor: "#ff8400",
                  color: "#fff",
                },
              },
              "& .MuiPagination-ul": {
                justifyContent: "center",
              },
            }}
          />
        </Stack>
      </div>
    </section>
  );
}

export default AdminListPage;
