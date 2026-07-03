import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IServiceTable } from "../../../interfaces/Itable";
import { useTranslation } from "react-i18next";
import noImage from "../../../assets/images/dummy.jpg";
import {
  deleteServiceApi,
  serviceApi,
} from "../../../service/apis/service.api";
import LoadingSpinner from "../../UI/loadingSpinner/LoadingSpinner";
import toast from "react-hot-toast";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import dataTable from "./datatable.module.scss";
import del from "../../../assets/images/ic_outline-delete.png";
import delt from "../../../assets/images/delete.png";

interface Props {
  bodyData: IServiceTable[];
  headData: string[];
  totalPage: number;
  currentPage: number;
  limit: number;
  onRefresh: () => void;
}

const ServiceTable: React.FC<Props> = ({
  bodyData,
  headData,
  totalPage,
  currentPage,
  limit,
  onRefresh,
}) => {
  // const location = useLocation();
  const { t } = useTranslation();

  const [data, setData] = useState<IServiceTable[]>(bodyData || []);
  const [page, setPage] = useState(currentPage || 1);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [addClass, setAddClass] = useState<string>("");
  const [currentTotalPage, setCurrentTotalPage] = useState<number>(totalPage);

  const [open, setOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );

  useEffect(() => {
    setData(bodyData || []);
    setCurrentTotalPage(totalPage);
  }, [bodyData, totalPage]);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setSearchTerm(searchQuery);

    try {
      setLoading(true);
      setAddClass("add_blur");
      const requestData = {
        currentPage: 1,
        limit,
        search: searchQuery,
      };

      const response = await serviceApi(requestData);
      if (response?.status === 200) {
        setData(response?.services || []);
        setCurrentTotalPage(response?.totalPages || 1);
        setPage(1);
      }
    } catch (err) {
      console.error("Failed to search data", err);
    } finally {
      setLoading(false);
      setAddClass("");
    }
  };

  const clearSearch = async () => {
    setSearchTerm("");
    try {
      setAddClass("add_blur");
      setLoading(true);
      const requestData = {
        currentPage: 1,
        limit,
        search: "",
      };

      const response = await serviceApi(requestData);
      if (response?.status === 200) {
        setData(response?.services || []);
        setCurrentTotalPage(response?.totalPages || 1);
        setPage(1);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
      setAddClass("");
    }
  };

  const handleClickOpen = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    if (!selectedServiceId) return;

    setLoading(true);
    try {
      const res = await deleteServiceApi(selectedServiceId);

      if (res?.status === 200 || res?.message) {
        toast.success("Service deleted successfully");
        setOpen(false);
        setSelectedServiceId(null);

        if (onRefresh) {
          onRefresh();
        }
      }
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete service");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = async (_: any, value: number) => {
    setPage(value);
    setLoading(true);
    try {
      setAddClass("add_blur");
      const response = await serviceApi({
        currentPage: value,
        limit,
        search: searchTerm,
      });

      if (response?.status === 200) {
        setData(response?.services || []);
        setCurrentTotalPage(response?.totalPages || 1);
      }
    } catch (err) {
      console.error("Pagination error", err);
    } finally {
      setLoading(false);
      setAddClass("");
    }
  };

  const ucwords = (str: string): string => {
    return str
      .split(" ")
      .map((word) =>
        word.replace(/\b\w/g, (char: string) => char.toUpperCase())
      )
      .join(" ");
  };

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl || imageUrl === "/no_image.png") return noImage;

    if (imageUrl.startsWith("http")) return imageUrl;

    return `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`;
  };

  return (
    <div style={{ position: "relative" }} className='dsp'>
      {loading && <LoadingSpinner />}

      <div
        className={`${dataTable.datatablemainwrap} ${
          addClass ? dataTable[addClass] : ""
        } colorAction`}
      >
        <div className='search-wrap'>
          <Link to='/admin/services/add'>
            <button className='table-btn'>Add Service</button>
          </Link>

          <div
            className='searchwrap'
            style={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "flex-start",
              position: "relative",
              marginTop: "20px",
            }}
          >
            <input
              type='text'
              placeholder='Search...'
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                padding: "8px 12px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                height: "50px",
                width: "100%",
              }}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "#999",
                }}
              >
                &times;
              </button>
            )}
          </div>
        </div>

        <div className='usertabledata'>
          <TableContainer className={dataTable.tbodymain} component={Paper}>
            <Table
              sx={{ minWidth: 1000 }}
              aria-label='simple table'
              style={{ borderCollapse: "separate", borderSpacing: "0px 15px" }}
            >
              <TableHead>
                <TableRow>
                  {headData.map((item, index) => (
                    <TableCell align='left' key={index}>
                      {ucwords(item)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody className={dataTable.tbodywrap}>
                {(data || []).map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      className={dataTable.productwrp}
                      component='th'
                      scope='row'
                    >
                      {/* <img
                        src={noImage}
                        alt='service'
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginRight: "10px",
                        }}
                      /> */}
                      <img
                        src={getImageUrl(row?.imageUrl)}
                        alt='service'
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginRight: "10px",
                        }}
                        onError={(e) => {
                          e.currentTarget.src = noImage;
                        }}
                      />
                      {row?.name}
                    </TableCell>

                    <TableCell align='left'>
                      ${row?.plans?.[0]?.price ?? 0}
                    </TableCell>

                    <TableCell align='left'>
                      <div className={dataTable.actionwrap}>
                        <Link
                          to={`/admin/services/edit/${row.id}`}
                          state={{ fromPage: page }}
                        >
                          <p className={dataTable.edit}>
                            <FontAwesomeIcon
                              icon={faPencilAlt}
                              style={{
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "16px",
                              }}
                            />
                          </p>
                        </Link>

                        <p
                          className={dataTable.delete}
                          onClick={() => handleClickOpen(row.id)}
                        >
                          <img src={del} alt='delete' />
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {data.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={headData.length} align='center'>
                      No services found
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
            count={currentTotalPage}
            page={page}
            onChange={handlePageChange}
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

      <Dialog
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "35px",
            overflowY: "inherit",
            padding: "40px",
            maxWidth: "562px",
          },
        }}
        maxWidth='md'
        fullWidth
        className={dataTable.custommodal}
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <div className={dataTable.modalimg}>
          <img src={delt} alt='Delete Confirmation' />
        </div>
        <DialogTitle
          id='alert-dialog-title'
          style={{
            textAlign: "center",
            fontSize: "32px",
            color: "red",
            fontWeight: "700",
          }}
        >
          {t("Delete Service")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id='alert-dialog-description'
            style={{
              textAlign: "center",
              color: "#676767",
              fontSize: "16px",
            }}
          >
            {t("Are you sure you want to delete this service?")}
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button onClick={handleClose} className='btn-cancel'>
            {t("Cancel")}
          </Button>
          <Button onClick={handleDelete} className='btn'>
            {t("Delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ServiceTable;
