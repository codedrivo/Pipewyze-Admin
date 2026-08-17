import React from "react";
import { Icon } from "@iconify/react";
import { useSupportRequests } from "./useSupportRequests";
import {
  Dialog,
  DialogTitle,
  DialogContent,
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

function SupportRequests() {
  const {
    requestsList,
    loading,
    replying,
    isReplyModalOpen,
    selectedRequest,
    replyText,
    setReplyText,
    handleOpenReply,
    handleCloseReply,
    handleReplySubmit,
  } = useSupportRequests();

  return (
    <div style={{ position: "relative" }} className='dsp'>
      {loading ? <LoadingSpinner /> : null}

      <div className={dataTable.datatablemainwrap}>
        {/* Header */}
        <div className='gc-profile-flex' style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 style={{ margin: 0, fontSize: "24px", color: "#111827", fontFamily: "'DM Sans', sans-serif" }}>
              Support Requests
            </h2>
          </div>
        </div>

        {/* Content Area */}
        {requestsList.length === 0 ? (
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
            <Icon icon='lucide:message-square' style={{ fontSize: "48px", color: "#9ca3af", marginBottom: "12px" }} />
            <p style={{ color: "#4b5563", fontSize: "16px", fontWeight: 500, margin: 0 }}>
              No support requests received yet
            </p>
          </div>
        ) : (
          <div className='usertabledata'>
            <TableContainer className={dataTable.tbodymain} component={Paper}>
              <Table
                sx={{ minWidth: 1000 }}
                aria-label='support list table'
                style={{ borderCollapse: "separate", borderSpacing: "0px 15px" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align='left' style={{ width: "20%" }}>Customer Info</TableCell>
                    <TableCell align='left' style={{ width: "45%" }}>Message</TableCell>
                    <TableCell align='left' style={{ width: "15%" }}>Status</TableCell>
                    <TableCell align='center' style={{ width: "20%" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody className={dataTable.tbodywrap}>
                  {requestsList.map((row) => (
                    <TableRow
                      key={row.id || row._id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align='left'>
                        <div>
                          <div style={{ fontWeight: "bold", color: "#1f2937" }}>
                            {`${row.firstName || ""} ${row.lastName || ""}`.trim()}
                          </div>
                          <div style={{ fontSize: "12px", color: "#6b7280" }}>
                            {row.email}
                          </div>
                          <div style={{ fontSize: "12px", color: "#6b7280" }}>
                            {row.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell align='left'>
                        <div>
                          <div style={{ fontWeight: "600", fontSize: "13px", marginBottom: "4px" }}>
                            {row.subject || "No Subject"}
                          </div>
                          <div style={{ color: "#4b5563", fontSize: "13px" }}>
                            {row.message}
                          </div>
                          {row.adminReply && (
                            <div style={{ marginTop: "8px", paddingLeft: "10px", borderLeft: "2px solid #335AFF", color: "#335AFF", fontSize: "12px" }}>
                              <strong>Reply:</strong> {row.adminReply}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell align='left'>
                        <span
                          className='admin-badge'
                          style={{
                            backgroundColor: row.status === "open" ? "#FEF2F2" : "#ECFDF5",
                            color: row.status === "open" ? "#EF4444" : "#10B981",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            display: "inline-block",
                          }}
                        >
                          {row.status}
                        </span>
                      </TableCell>
                      <TableCell align='center'>
                        {row.status === "open" ? (
                          <button
                            onClick={() => handleOpenReply(row)}
                            style={{
                              padding: "6px 16px",
                              fontSize: "13px",
                              fontWeight: 600,
                              backgroundColor: "#335AFF",
                              color: "#fff",
                              borderRadius: "8px",
                              border: "none",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "32px",
                            }}
                          >
                            Reply
                          </button>
                        ) : (
                          <span style={{ fontSize: "12px", color: "#9ca3af" }}>Resolved</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      <Dialog
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "35px",
            overflowY: "inherit",
            padding: "40px",
            maxWidth: "650px",
          },
        }}
        maxWidth='md'
        fullWidth
        className={dataTable.custommodal}
        open={isReplyModalOpen}
        onClose={handleCloseReply}
      >
        <DialogTitle style={{ fontWeight: "700", fontSize: "28px", textAlign: "center", color: "#000", padding: 0, marginBottom: "15px" }}>
          Reply to Support Request
        </DialogTitle>
        <DialogContent style={{ padding: 0 }}>
          {selectedRequest && (
            <div style={{ marginBottom: "20px", background: "#f9fafb", padding: "18px", borderRadius: "16px", border: "1px solid #f3f4f6" }}>
              <p style={{ margin: "0 0 8px", fontSize: "14px" }}>
                <strong>From:</strong> {`${selectedRequest.firstName} ${selectedRequest.lastName || ""}`} ({selectedRequest.email})
              </p>
              <p style={{ margin: "0 0 8px", fontSize: "14px" }}>
                <strong>Subject:</strong> {selectedRequest.subject || "No Subject"}
              </p>
              <p style={{ margin: 0, fontSize: "14px", color: "#4b5563" }}>
                <strong>Message:</strong> {selectedRequest.message}
              </p>
            </div>
          )}

          <div className='formgrp' style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label htmlFor="replyText" style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>Your Reply Message:</label>
            <textarea
              id="replyText"
              rows={5}
              placeholder="Type reply here... (an HTML email will be sent automatically to the customer)"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              style={{
                width: "100%",
                border: "1px solid #d1d5db",
                borderRadius: "12px",
                padding: "12px",
                fontFamily: "inherit",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
            />
          </div>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center", gap: "15px", marginTop: "20px", padding: 0 }}>
          <Button onClick={handleCloseReply} className='btn-cancel' style={{ border: "1px solid #ccc", borderRadius: "20px", padding: "8px 25px", textTransform: "none", color: "#666" }}>
            Cancel
          </Button>
          <Button
            onClick={handleReplySubmit}
            disabled={replying || !replyText.trim()}
            className='btn'
            style={{ background: "#335AFF", color: "#fff", borderRadius: "20px", padding: "8px 25px", textTransform: "none" }}
          >
            {replying ? "Sending..." : "Send Reply"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withRole(SupportRequests, ["admin"]);
