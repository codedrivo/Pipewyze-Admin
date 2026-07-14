import React from "react";
import { Icon } from "@iconify/react";
import { useEquipment } from "./useEquipment";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import withRole from "../withRole";
import dataTable from "../../components/tables/customTable/datatable.module.scss";
import del from "../../assets/images/ic_outline-delete.png";
import delt from "../../assets/images/delete.png";

function Equipment() {
  const user = useSelector((state: RootState) => state.authSlice.user);
  const isPlumber = user?.role === "licensed-plumber";

  const {
    navigate,
    fileInputRef,
    equipmentList,
    plumberName,
    loading,
    submitting,
    isModalOpen,
    editingEquipment,
    imagePreview,
    openDeleteDialog,
    formik,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
    handleImageChange,
    handleDeleteClick,
    handleCloseDelete,
    handleDeleteConfirm,
    plumbersList,
    selectedPlumberId,
    setSelectedPlumberId,
    paramPlumberId,
  } = useEquipment();

  const CATEGORIES = [
    "Water Heaters",
    "Pressure Reducing Valves",
    "Shut-off Valves",
    "Water Softeners",
    "Whole-house Filters",
    "Toilets",
    "Faucets",
    "Showerheads",
  ];

  return (
    <div style={{ position: "relative" }} className='dsp'>
      {loading ? <LoadingSpinner /> : null}

      <style>{`
        .equipment-add-btn {
          width: auto !important;
          margin-top: 0 !important;
        }
      `}</style>

      <div className={dataTable.datatablemainwrap}>
        {/* Header wrapper */}
        <div className='gc-profile-flex' style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {!isPlumber && (
              <button
                onClick={() => {
                  if (paramPlumberId) {
                    navigate("/admin/equipment");
                  } else {
                    navigate("/admin/users");
                  }
                }}
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
            )}
            <h2 style={{ margin: 0, fontSize: "24px", color: "#111827", fontFamily: "'DM Sans', sans-serif" }}>
              {isPlumber ? "Equipment" : paramPlumberId ? `Equipment - ${plumberName}` : "Plumbers"}
            </h2>
          </div>



          {(isPlumber || paramPlumberId) && (
            <button className='custom-button equipment-add-btn' onClick={handleOpenAddModal}>
              Add Equipment
            </button>
          )}
        </div>

        {/* Content Area */}
        {!isPlumber && !paramPlumberId ? (
          <div className='usertabledata'>
            <TableContainer className={dataTable.tbodymain} component={Paper}>
              <Table
                sx={{ minWidth: 1000 }}
                aria-label='plumbers list table'
                style={{ borderCollapse: "separate", borderSpacing: "0px 15px" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align='left'>Plumber</TableCell>
                    <TableCell align='left'>Email</TableCell>
                    <TableCell align='left'>Phone</TableCell>
                    <TableCell align='center'>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody className={dataTable.tbodywrap}>
                  {plumbersList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align='center'>
                        No plumbers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    plumbersList.map((row) => (
                      <TableRow
                        key={row._id || row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align='left'>
                          <div
                            className='admin-user-cell'
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <div
                              className='admin-user-avatar'
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                overflow: "hidden",
                              }}
                            >
                              <img
                                src={row.profileimageurl || "/default_profile.png"}
                                alt='Plumber Avatar'
                                onError={(e) => {
                                  e.currentTarget.src = "/default_profile.png";
                                }}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                            <div>
                              <div style={{ fontWeight: "bold" }}>
                                {row.fullName ||
                                  `${row.firstName || ""} ${row.lastName || ""}`.trim() ||
                                  "—"}
                              </div>
                              <span style={{ fontSize: "11px", color: "#888" }}>
                                {row.createdAt
                                  ? new Date(row.createdAt).toLocaleDateString("en-GB")
                                  : ""}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell align='left'>{row.email}</TableCell>
                        <TableCell align='left'>{row.phone || "—"}</TableCell>
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
                              onClick={() => navigate(`/admin/equipment/${row._id || row.id}`)}
                              style={{ cursor: "pointer", margin: 0, backgroundColor: "#3b82f6" }}
                              title="Edit/View Equipment"
                            >
                              <Icon
                                icon='mdi:pencil-outline'
                                style={{ fontSize: "20px", color: "#fff" }}
                              />
                            </p>
                            <p
                              className={dataTable.edit}
                              onClick={() => navigate(`/admin/equipment/${row._id || row.id}`, { state: { openAddModal: true } })}
                              style={{ cursor: "pointer", margin: 0, backgroundColor: "#10b981" }}
                              title="Add Equipment"
                            >
                              <Icon
                                icon='mdi:plus'
                                style={{ fontSize: "20px", color: "#fff" }}
                              />
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ) : equipmentList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "#f9fafb", borderRadius: "12px", border: "1px dashed #e5e7eb", marginTop: "20px" }}>
            <Icon icon='mdi:tools' style={{ fontSize: "48px", color: "#9ca3af", marginBottom: "12px" }} />
            <p style={{ color: "#6b7280", fontSize: "16px", margin: 0 }}>No equipment added yet.</p>
          </div>
        ) : (
          <div className='usertabledata' style={{ marginTop: "20px" }}>
            <TableContainer className={dataTable.tbodymain} component={Paper}>
              <Table
                sx={{ minWidth: 1000 }}
                aria-label='equipment list table'
                style={{ borderCollapse: "separate", borderSpacing: "0px 15px" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align='left'>Image</TableCell>
                    <TableCell align='left'>Category</TableCell>
                    <TableCell align='left'>Brand & Model</TableCell>
                    <TableCell align='left'>Installation Date</TableCell>
                    <TableCell align='left'>Next Service Date</TableCell>
                    <TableCell align='center'>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody className={dataTable.tbodywrap}>
                  {equipmentList.map((row) => (
                    <TableRow
                      key={row.id || row._id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align='left'>
                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "8px",
                            overflow: "hidden",
                            background: "#f3f4f6",
                          }}
                        >
                          <img
                            src={row.image || "/no_image.png"}
                            alt={row.category}
                            onError={(e) => {
                              e.currentTarget.src = "/no_image.png";
                            }}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </TableCell>
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
                          {row.category}
                        </span>
                      </TableCell>
                      <TableCell align='left'>
                        <div style={{ fontWeight: "bold", color: "#1f2937" }}>
                          {row.brand || "—"}
                        </div>
                        {row.model && (
                          <span style={{ fontSize: "12px", color: "#6b7280" }}>
                            Model: {row.model}
                          </span>
                        )}
                      </TableCell>
                      <TableCell align='left'>
                        {row.installationDate
                          ? new Date(row.installationDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                          : "—"}
                      </TableCell>
                      <TableCell align='left'>
                        <span
                          style={{
                            color: row.nextServiceDate ? "#ef4444" : "#374151",
                            fontWeight: row.nextServiceDate ? 600 : 400,
                          }}
                        >
                          {row.nextServiceDate
                            ? new Date(row.nextServiceDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                            : "—"}
                        </span>
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

      {/* Add / Edit Equipment Modal */}
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
          {editingEquipment ? "Edit Equipment" : "Add Equipment"}
          <button
            onClick={handleCloseModal}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Icon icon='mdi:close' style={{ fontSize: "24px", color: "#9ca3af" }} />
          </button>
        </DialogTitle>

        <DialogContent style={{ padding: "10px 0 0 0" }}>
          <form onSubmit={formik.handleSubmit}>
            {/* Circular Image Upload */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  backgroundColor: "#f3f4f6",
                  border: "2px dashed #d1d5db",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt='Equipment' style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <>
                    <Icon icon='mdi:camera' style={{ fontSize: "36px", color: "#9ca3af" }} />
                  </>
                )}
              </div>
              <span style={{ fontSize: "14px", color: "#4b5563", marginTop: "8px", fontWeight: 600 }}>
                {imagePreview ? "Change Image" : "Add Image"}
              </span>
            </div>

            {/* Choose Category */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Choose Category <span style={{ color: "red" }}>*</span>
              </label>
              <select
                name='category'
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1.5px solid #d1d5db",
                  fontSize: "16px",
                  outline: "none",
                  backgroundColor: "#ffffff",
                }}
              >
                <option value="" disabled>Select a Category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {formik.touched.category && formik.errors.category && (
                <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                  {formik.errors.category}
                </div>
              )}
            </div>

            {/* Brand */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Brand
              </label>
              <input
                type='text'
                name='brand'
                placeholder='e.g. Rheem'
                value={formik.values.brand}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1.5px solid #d1d5db",
                  fontSize: "16px",
                  outline: "none",
                }}
              />
            </div>

            {/* Model */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Model
              </label>
              <input
                type='text'
                name='model'
                placeholder='e.g. PER 40'
                value={formik.values.model}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1.5px solid #d1d5db",
                  fontSize: "16px",
                  outline: "none",
                }}
              />
            </div>

            {/* Installation Date */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Installation Date
              </label>
              <input
                type='date'
                name='installationDate'
                value={formik.values.installationDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1.5px solid #d1d5db",
                  fontSize: "16px",
                  outline: "none",
                }}
              />
            </div>

            {/* Next Service Date */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Next Service Date
              </label>
              <input
                type='date'
                name='nextServiceDate'
                value={formik.values.nextServiceDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1.5px solid #d1d5db",
                  fontSize: "16px",
                  outline: "none",
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
                {submitting ? "Saving..." : editingEquipment ? "Save Changes" : "Add Equipment +"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog matching GraveCare */}
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
          {"Delete Equipment"}
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
            {"Are you sure you want to delete this equipment? This action cannot be undone."}
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

export default withRole(Equipment, ["admin", "licensed-plumber"]);
