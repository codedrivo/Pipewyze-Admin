import React from "react";
import { Icon } from "@iconify/react";
import { useFaqs } from "./useFaqs";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Pagination,
} from "@mui/material";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import withRole from "../withRole";
import dataTable from "../../components/tables/customTable/datatable.module.scss";
import del from "../../assets/images/ic_outline-delete.png";
import delt from "../../assets/images/delete.png";

function Faqs() {
  const navigate = useNavigate();
  const {
    faqsList,
    loading,
    page,
    setPage,
    totalPages,
    search,
    handleSearchChange,
    openDeleteDialog,
    handleDeleteClick,
    handleCloseDelete,
    handleDeleteConfirm,
  } = useFaqs();

  return (
    <div style={{ position: "relative" }} className='dsp'>
      {loading ? <LoadingSpinner /> : null}

      <style>{`
        .faq-add-btn {
          width: auto !important;
          margin-top: 0 !important;
        }
        .searchgrp {
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          height: 40px;
          max-width: 400px;
          padding: 0 12px;
        }
        .searchgrp input {
          border: none;
          outline: none;
          width: 100%;
          margin-left: 8px;
          font-size: 14px;
        }
      `}</style>

      <div className={dataTable.datatablemainwrap}>
        {/* Header */}
        <div className='gc-profile-flex' style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 style={{ margin: 0, fontSize: "24px", color: "#111827", fontFamily: "'DM Sans', sans-serif" }}>
              Support & FAQs
            </h2>
          </div>

          <button className='custom-button faq-add-btn' onClick={() => navigate("/admin/add-faq")}>
            Add FAQ
          </button>
        </div>

        {/* Search */}
        <div className="searchgrp">
          <Icon icon="lucide:search" style={{ color: "#9ca3af", fontSize: "20px" }} />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        {/* Content Area */}
        {faqsList.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 20px",
              background: "#ffffff",
              borderRadius: "24px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Icon icon='lucide:help-circle' style={{ fontSize: "48px", color: "#9ca3af", marginBottom: "12px" }} />
            <p style={{ color: "#4b5563", fontSize: "16px", fontWeight: 500, margin: 0 }}>
              No FAQs registered yet
            </p>
          </div>
        ) : (
          <div className='usertabledata'>
            <TableContainer className={dataTable.tbodymain} component={Paper}>
              <Table
                sx={{ minWidth: 1000 }}
                aria-label='faq list table'
                style={{ borderCollapse: "separate", borderSpacing: "0px 15px" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align='left' style={{ width: "35%" }}>Question</TableCell>
                    <TableCell align='left' style={{ width: "55%" }}>Answer</TableCell>
                    <TableCell align='center' style={{ width: "10%" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody className={dataTable.tbodywrap}>
                  {faqsList.map((row) => (
                    <TableRow
                      key={row.id || row._id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align='left'>
                        <div style={{ fontWeight: "bold", color: "#1f2937" }}>
                          {row.question}
                        </div>
                      </TableCell>
                      <TableCell align='left'>
                        <div
                          style={{ color: "#4b5563" }}
                          dangerouslySetInnerHTML={{ __html: row.answer }}
                        />
                      </TableCell>
                      <TableCell align='center'>
                        <div
                          className={dataTable.actionwrap}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "10px",
                          }}
                        >
                          <p
                            className={dataTable.edit}
                            onClick={() => navigate(`/admin/edit-faq/${row._id || row.id}`)}
                            style={{ cursor: "pointer", margin: 0, backgroundColor: "#3b82f6" }}
                            title="Edit"
                          >
                            <Icon
                              icon='mdi:pencil-outline'
                              style={{ fontSize: "20px", color: "#fff" }}
                            />
                          </p>
                          <p
                            className={dataTable.delete}
                            onClick={() => handleDeleteClick(row.id || row._id)}
                            style={{ cursor: "pointer", margin: 0, backgroundColor: "#ef4444" }}
                            title="Delete"
                          >
                            <img src={del} alt='Delete' style={{ width: "20px" }} />
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination Footer */}
            {totalPages > 1 && (
              <Stack spacing={2} style={{ marginTop: "20px" }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, val) => setPage(val)}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "#6b7280",
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
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
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
        open={openDeleteDialog}
        onClose={handleCloseDelete}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <div className={dataTable.modalimg} style={{ textAlign: "center", marginBottom: "20px" }}>
          <img src={delt} alt='Delete Confirmation' style={{ width: "80px" }} />
        </div>
        <DialogTitle
          id='alert-dialog-title'
          style={{
            textAlign: "center",
            fontSize: "32px",
            color: "#000",
            fontWeight: "700",
          }}
        >
          {"Delete FAQ"}
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
            {"Are you sure you want to delete this FAQ? This action cannot be undone."}
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center", gap: "15px", marginTop: "10px" }}>
          <Button onClick={handleCloseDelete} className='btn-cancel' style={{ border: "1px solid #ccc", borderRadius: "20px", padding: "8px 25px", textTransform: "none", color: "#666" }}>
            {"Cancel"}
          </Button>
          <Button onClick={handleDeleteConfirm} className='btn' style={{ background: "#EF4444", color: "#fff", borderRadius: "20px", padding: "8px 25px", textTransform: "none" }}>
            {"Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withRole(Faqs, ["admin"]);
