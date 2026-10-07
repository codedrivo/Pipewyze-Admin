import React from "react";
import { Icon } from "@iconify/react";
import { usePlumbingCodes } from "./usePlumbingCodes";
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
} from "@mui/material";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import withRole from "../withRole";
import dataTable from "../../components/tables/customTable/datatable.module.scss";
import del from "../../assets/images/ic_outline-delete.png";
import delt from "../../assets/images/delete.png";

function PlumbingCodes() {
  const navigate = useNavigate();
  const {
    codesList,
    loading,
    openDeleteDialog,
    handleDeleteClick,
    handleCloseDelete,
    handleDeleteConfirm,
  } = usePlumbingCodes();

  return (
    <div style={{ position: "relative" }} className='dsp'>
      {loading ? <LoadingSpinner /> : null}

      <style>{`
        .code-add-btn {
          width: auto !important;
          margin-top: 0 !important;
        }
      `}</style>

      <div className={dataTable.datatablemainwrap}>
        {/* Header wrapper */}
        <div className='gc-profile-flex' style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 style={{ margin: 0, fontSize: "24px", color: "#111827", fontFamily: "'DM Sans', sans-serif" }}>
              Plumbing Code Library
            </h2>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button className='custom-button code-add-btn' onClick={() => navigate("/admin/plumbing-codes/add")}>
              Add Plumbing Code
            </button>
          </div>
        </div>

        {/* Content Area */}
        {codesList.length === 0 ? (
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
            <Icon icon='mdi:book-open-page-variant' style={{ fontSize: "48px", color: "#9ca3af", marginBottom: "12px" }} />
            <p style={{ color: "#4b5563", fontSize: "16px", fontWeight: 500, margin: 0 }}>
              No plumbing codes registered yet
            </p>
          </div>
        ) : (
          <div className='usertabledata'>
            <TableContainer className={dataTable.tbodymain} component={Paper} style={{ overflowX: "hidden" }}>
              <Table
                sx={{ width: "100%", tableLayout: "fixed" }}
                aria-label='plumbing codes list table'
                style={{ borderCollapse: "separate", borderSpacing: "0px 15px" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align='left' style={{ width: "14%" }}>Code Identifier</TableCell>
                    <TableCell align='left' style={{ width: "18%" }}>Title</TableCell>
                    <TableCell align='left' style={{ width: "16%" }}>Category</TableCell>
                    <TableCell align='left' style={{ width: "24%" }}>Description</TableCell>
                    <TableCell align='left' style={{ width: "20%" }}>Plain Language Interpretation</TableCell>
                    <TableCell align='center' style={{ width: "8%" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody className={dataTable.tbodywrap}>
                  {codesList.map((row) => (
                    <TableRow
                      key={row.id || row._id}
                      sx={{
                        "& > td": { verticalAlign: "top", paddingTop: "20px", paddingBottom: "20px" },
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align='left' style={{ wordBreak: "break-word" }}>
                        <div style={{ fontWeight: "bold", color: "#1f2937" }}>
                          {row.code}
                        </div>
                      </TableCell>
                      <TableCell align='left' style={{ wordBreak: "break-word" }}>
                        <div style={{ fontWeight: 600, color: "#374151" }}>
                          {row.title}
                        </div>
                      </TableCell>
                      <TableCell align='left'>
                        {row.categoryFullName || row.category ? (
                          <span
                            style={{
                              backgroundColor: "#f0fdf4",
                              color: "#166534",
                              border: "1px solid #bbf7d0",
                              padding: "4px 10px",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: 600,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              wordBreak: "break-word",
                            }}
                          >
                            {row.categoryFullName || row.category}
                          </span>
                        ) : (
                          <span style={{ color: "#94a3b8", fontSize: "13px" }}>—</span>
                        )}
                      </TableCell>
                      <TableCell align='left'>
                        <div
                          style={{
                            color: "#4b5563",
                            fontSize: "13px",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            wordBreak: "break-word",
                          }}
                          title={row.description ? row.description.replace(/<[^>]*>/g, "") : ""}
                          dangerouslySetInnerHTML={{ __html: row.description || "" }}
                        />
                        {row.exception && (
                          <div
                            style={{
                              color: "#dc2626",
                              fontSize: "12px",
                              marginTop: "4px",
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              wordBreak: "break-word",
                            }}
                            title={row.exception ? row.exception.replace(/<[^>]*>/g, "") : ""}
                            dangerouslySetInnerHTML={{ __html: `<strong>Exception:</strong> ${row.exception}` }}
                          />
                        )}
                      </TableCell>
                      <TableCell align='left'>
                        <div
                          style={{
                            color: "#4b5563",
                            fontSize: "13px",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            wordBreak: "break-word",
                          }}
                          title={row.plainLanguageInterpretation ? row.plainLanguageInterpretation.replace(/<[^>]*>/g, "") : ""}
                          dangerouslySetInnerHTML={{ __html: row.plainLanguageInterpretation || "" }}
                        />
                      </TableCell>
                      <TableCell align='left' style={{ maxWidth: "200px" }}>
                        {(() => {
                          const docUrl = row.documentUrl || (row.documents && row.documents[0]?.url);
                          const docName = row.documentName || (row.documents && row.documents[0]?.name) || "View Document";
                          if (!docUrl) return <span style={{ color: "#9ca3af", fontSize: "13px" }}>N/A</span>;
                          return (
                            <a
                              href={docUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                color: "#2563eb",
                                fontWeight: 500,
                                fontSize: "13px",
                                textDecoration: "underline",
                              }}
                              title={docName}
                            >
                              <Icon icon='mdi:file-pdf-box' style={{ fontSize: "18px", color: "#dc2626", flexShrink: 0 }} />
                              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {docName}
                              </span>
                            </a>
                          );
                        })()}
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
                            onClick={() => navigate(`/admin/plumbing-codes/edit/${row._id || row.id}`)}
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
          {"Delete Plumbing Code"}
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
            {"Are you sure you want to delete this plumbing code? This action cannot be undone."}
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

export default withRole(PlumbingCodes, ["admin"]);
