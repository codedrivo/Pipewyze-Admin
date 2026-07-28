import React from "react";
import { Icon } from "@iconify/react";
import { usePlumbingCodes } from "./usePlumbingCodes";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import withRole from "../withRole";
import dataTable from "../../components/tables/customTable/datatable.module.scss";
import del from "../../assets/images/ic_outline-delete.png";
import delt from "../../assets/images/delete.png";

function PlumbingCodes() {
  const {
    codesList,
    loading,
    submitting,
    isModalOpen,
    editingCode,
    openDeleteDialog,
    formik,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
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

          <button className='custom-button code-add-btn' onClick={handleOpenAddModal}>
            Add Plumbing Code
          </button>
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
            <TableContainer className={dataTable.tbodymain} component={Paper}>
              <Table
                sx={{ minWidth: 1000 }}
                aria-label='plumbing codes list table'
                style={{ borderCollapse: "separate", borderSpacing: "0px 15px" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align='left'>Code Identifier</TableCell>
                    <TableCell align='left'>Title</TableCell>
                    <TableCell align='left'>Category</TableCell>
                    <TableCell align='left'>Description</TableCell>
                    <TableCell align='left'>Plain Language Interpretation</TableCell>
                    <TableCell align='center'>Actions</TableCell>
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
                      <TableCell align='left'>
                        <div style={{ fontWeight: "bold", color: "#1f2937" }}>
                          {row.code}
                        </div>
                      </TableCell>
                      <TableCell align='left'>
                        <div style={{ fontWeight: 600, color: "#374151" }}>
                          {row.title}
                        </div>
                      </TableCell>
                      <TableCell align='left'>
                        <span
                          style={{
                            background: row.category === "MUPC" ? "#eff6ff" : "#f0fdf4",
                            color: row.category === "MUPC" ? "#2563eb" : "#16a34a",
                            padding: "4px 10px",
                            borderRadius: "9999px",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {row.category}
                        </span>
                      </TableCell>
                      <TableCell align='left' style={{ maxWidth: "250px" }}>
                        <div style={{ color: "#4b5563", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={row.description}>
                          {row.description}
                        </div>
                        {row.exception && (
                          <div style={{ color: "#dc2626", fontSize: "12px", marginTop: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={row.exception}>
                            <strong>Exception:</strong> {row.exception}
                          </div>
                        )}
                      </TableCell>
                      <TableCell align='left' style={{ maxWidth: "250px" }}>
                        <div style={{ color: "#4b5563", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={row.plainLanguageInterpretation}>
                          {row.plainLanguageInterpretation}
                        </div>
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
                            onClick={() => handleOpenEditModal(row)}
                            style={{ cursor: "pointer", margin: 0, backgroundColor: "#3b82f6" }}
                            title="Edit"
                          >
                            <Icon
                              icon='mdi:pencil-outline'
                              style={{ fontSize: "20px", color: "#fff" }}
                            />
                          </p>
                          <p
                            className={dataTable.edit}
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

      {/* Add / Edit Code Modal */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          style: {
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          style={{
            textAlign: "center",
            fontSize: "28px",
            fontWeight: 800,
            fontFamily: "'DM Sans', sans-serif",
            color: "#111827",
            padding: "0 0 20px 0",
            position: "relative",
          }}
        >
          {editingCode ? "Edit Plumbing Code" : "Add Plumbing Code"}
          <button
            onClick={handleCloseModal}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#9ca3af",
            }}
          >
            <Icon icon='mdi:close' style={{ fontSize: "24px" }} />
          </button>
        </DialogTitle>

        <DialogContent style={{ padding: "10px 0" }}>
          <form onSubmit={formik.handleSubmit}>
            {/* Category selection */}
            <FormControl fullWidth style={{ marginBottom: "16px" }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formik.values.category}
                label="Category"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{ borderRadius: "12px" }}
              >
                <MenuItem value="MUPC">Massachusetts Uniform Plumbing Code (MUPC)</MenuItem>
                <MenuItem value="IPC">International Plumbing Code (IPC)</MenuItem>
              </Select>
            </FormControl>

            {/* Code Identifier */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Code Identifier
              </label>
              <input
                type='text'
                name='code'
                placeholder='e.g. 248 CMR 10.05(6)(a)'
                value={formik.values.code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: `1.5px solid ${formik.touched.code && formik.errors.code ? "#ef4444" : "#d1d5db"}`,
                  fontSize: "16px",
                  outline: "none",
                }}
              />
              {formik.touched.code && formik.errors.code && (
                <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{formik.errors.code}</div>
              )}
            </div>

            {/* Title */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Title
              </label>
              <input
                type='text'
                name='title'
                placeholder='e.g. Traps - Seal Depth'
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: `1.5px solid ${formik.touched.title && formik.errors.title ? "#ef4444" : "#d1d5db"}`,
                  fontSize: "16px",
                  outline: "none",
                }}
              />
              {formik.touched.title && formik.errors.title && (
                <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{formik.errors.title}</div>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Legal Clause Description
              </label>
              <textarea
                name='description'
                placeholder='Fixtures shall be provided with traps having a water seal depth...'
                rows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: `1.5px solid ${formik.touched.description && formik.errors.description ? "#ef4444" : "#d1d5db"}`,
                  fontSize: "16px",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
              {formik.touched.description && formik.errors.description && (
                <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{formik.errors.description}</div>
              )}
            </div>

            {/* Exception */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Exception (Optional)
              </label>
              <textarea
                name='exception'
                placeholder='e.g. Exception: Fixture traps shall be permitted to have...'
                rows={2}
                value={formik.values.exception}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1.5px solid #d1d5db",
                  fontSize: "16px",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* Plain Language Interpretation */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Plain Language Interpretation
              </label>
              <textarea
                name='plainLanguageInterpretation'
                placeholder='Fixture must have traps with a water seal at least 1-1/2 inches deep...'
                rows={3}
                value={formik.values.plainLanguageInterpretation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: `1.5px solid ${formik.touched.plainLanguageInterpretation && formik.errors.plainLanguageInterpretation ? "#ef4444" : "#d1d5db"}`,
                  fontSize: "16px",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
              {formik.touched.plainLanguageInterpretation && formik.errors.plainLanguageInterpretation && (
                <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{formik.errors.plainLanguageInterpretation}</div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
              <button
                type='button'
                onClick={handleCloseModal}
                disabled={submitting}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: "12px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "#ffffff",
                  color: "#4b5563",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={submitting}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {submitting ? "Saving..." : editingCode ? "Save Changes" : "Add Code +"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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
