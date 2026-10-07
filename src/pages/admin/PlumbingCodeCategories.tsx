import React from "react";
import { Icon } from "@iconify/react";
import { usePlumbingCodeCategories } from "./usePlumbingCodeCategories";
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
import Input from "../../components/UI/input/Input";
import dataTable from "../../components/tables/customTable/datatable.module.scss";
import del from "../../assets/images/ic_outline-delete.png";
import delt from "../../assets/images/delete.png";

function PlumbingCodeCategories() {
  const {
    navigate,
    categoriesList,
    loading,
    submitting,
    isModalOpen,
    editingCategory,
    openDeleteDialog,
    formik,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
    handleDeleteClick,
    handleCloseDelete,
    handleDeleteConfirm,
  } = usePlumbingCodeCategories();

  return (
    <div style={{ position: "relative" }} className='dsp'>
      {loading ? <LoadingSpinner /> : null}

      <style>{`
        .cat-add-btn {
          width: auto !important;
          margin-top: 0 !important;
        }
      `}</style>

      <div className={dataTable.datatablemainwrap}>
        {/* Header wrapper */}
        <div className='gc-profile-flex' style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => navigate("/admin/plumbing-codes")}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                color: "#1e3a8a",
              }}
            >
              <Icon icon='mdi:arrow-left' style={{ fontSize: "28px" }} />
            </button>
            <h2 style={{ margin: 0, fontSize: "24px", color: "#111827", fontFamily: "'DM Sans', sans-serif" }}>
              Plumbing Code Categories
            </h2>
          </div>

          <button className='custom-button cat-add-btn' onClick={handleOpenAddModal}>
            Add Category
          </button>
        </div>

        {/* Content Area */}
        {categoriesList.length === 0 ? (
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
            <Icon icon='mdi:label-outline' style={{ fontSize: "48px", color: "#9ca3af", marginBottom: "12px" }} />
            <p style={{ color: "#4b5563", fontSize: "16px", fontWeight: 500, margin: 0 }}>
              No categories registered yet
            </p>
          </div>
        ) : (
          <div className='usertabledata'>
            <TableContainer className={dataTable.tbodymain} component={Paper}>
              <Table
                sx={{ minWidth: 600 }}
                aria-label='categories list table'
                style={{ borderCollapse: "separate", borderSpacing: "0px 15px" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align='left'>Category Name</TableCell>
                    <TableCell align='left'>Category Full Name</TableCell>
                    <TableCell align='left'>Description</TableCell>
                    <TableCell align='center'>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody className={dataTable.tbodywrap}>
                  {categoriesList.map((row) => (
                    <TableRow
                      key={row.id || row._id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align='left'>
                        <span
                          style={{
                            background: "#eff6ff",
                            color: "#2563eb",
                            padding: "4px 10px",
                            borderRadius: "9999px",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {row.name}
                        </span>
                      </TableCell>
                      <TableCell align='left'>
                        <div style={{ color: "#111827", fontWeight: 500 }}>
                          {row.fullName || "—"}
                        </div>
                      </TableCell>
                      <TableCell align='left'>
                        <div style={{ color: "#4b5563" }}>
                          {row.description || "—"}
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

      {/* Add / Edit Category Modal */}
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
          {editingCategory ? "Edit Category" : "Add Category"}
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
            {/* Category Full Name */}
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
                Category Full Name <span style={{ color: "red" }}>*</span>
              </label>
              <Input
                classes='passwordlabel'
                type='text'
                id='fullName'
                name='fullName'
                placeholder='e.g. Massachusetts Uniform Plumbing Code'
                value={formik.values.fullName}
                onChange={(e) => {
                  const val = e.target.value;
                  formik.setFieldValue("fullName", val);
                  if (!editingCategory) {
                    const acronym = val
                      .split(/\s+/)
                      .map((word) => word.charAt(0))
                      .join("")
                      .toUpperCase();
                    formik.setFieldValue("name", acronym);
                  }
                }}
                onBlur={formik.handleBlur}
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{formik.errors.fullName}</div>
              )}
            </div>

            {/* Category Name */}
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
                Category Name <span style={{ color: "red" }}>*</span>
              </label>
              <Input
                classes='passwordlabel'
                type='text'
                id='name'
                name='name'
                placeholder='e.g. MUPC or IPC'
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{formik.errors.name}</div>
              )}
            </div>

            {/* Description */}
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
                Description (Optional)
              </label>
              <textarea
                name='description'
                placeholder='Category description...'
                rows={3}
                value={formik.values.description}
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
                {submitting ? "Saving..." : editingCategory ? "Save Changes" : "Add Category"}
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
          {"Delete Category"}
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
            {"Are you sure you want to delete this category? This action cannot be undone."}
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

export default withRole(PlumbingCodeCategories, ["admin"]);
