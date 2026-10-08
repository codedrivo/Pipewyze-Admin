import React from "react";
import { Icon } from "@iconify/react";
import { useUsers } from "./useUsers";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import withRole from "../withRole";
import dataTable from "../../components/tables/customTable/datatable.module.scss";
import del from "../../assets/images/ic_outline-delete.png";
import delt from "../../assets/images/delete.png";

function Users() {
  const {
    navigate,
    users,
    loading,
    totalResult,
    totalPages,
    currentPage,
    setCurrentPage,
    searchTerm,
    selectedRole,
    addClass,
    openDeleteDialog,
    handleSearchChange,
    handleRoleChange,
    clearSearch,
    handleDeleteClick,
    handleCloseDelete,
    handleDeleteConfirm,
  } = useUsers();

  return (
    <div style={{ position: "relative" }} className='dsp'>
      {loading ? <LoadingSpinner /> : null}

      <div
        className={`${dataTable.datatablemainwrap} ${addClass ? dataTable[addClass] : ""
          } colorAction`}
      >
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              fontWeight: 700,
              color: "#111827",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            User Management
          </h2>

          <button
            className='custom-button w-auto sm'
            onClick={() => navigate("/admin/users/add-user")}
            style={{
              margin: 0,
              width: "auto",
              whiteSpace: "nowrap",
              height: "44px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              padding: "0 18px",
              borderRadius: "10px",
            }}
          >
            <Icon icon='mdi:plus' style={{ fontSize: "18px" }} />
            Add User
          </button>
        </div>

        {/* Filter & Search Control Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginBottom: "20px",
            width: "100%",
          }}
        >
          {/* Search Input */}
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <Icon
              icon='fluent:search-28-filled'
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "18px",
                color: "#9CA3AF",
                pointerEvents: "none",
              }}
            />
            <input
              type='text'
              placeholder='Search by Name or Email...'
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                padding: "8px 36px 8px 40px",
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
                height: "46px",
                width: "100%",
                fontSize: "14px",
                color: "#1F2937",
                outline: "none",
                boxSizing: "border-box",
                transition: "all 0.2s ease",
              }}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                type='button'
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#9CA3AF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                &times;
              </button>
            )}
          </div>

          {/* Role dropdown filter */}
          <div style={{ position: "relative", width: "220px", flexShrink: 0 }}>
            <select
              value={selectedRole}
              onChange={handleRoleChange}
              style={{
                padding: "8px 36px 8px 14px",
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
                height: "46px",
                width: "100%",
                backgroundColor: "#FFFFFF",
                color: "#1F2937",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                boxSizing: "border-box",
                appearance: "none",
                WebkitAppearance: "none",
                outline: "none",
              }}
            >
              <option value=''>All Roles</option>
              <option value='home-owner'>Home Owner</option>
              <option value='apprentice'>Apprentice</option>
              <option value='licensed-plumber'>Licensed Plumber</option>
            </select>
            <Icon
              icon='mdi:chevron-down'
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "20px",
                color: "#6B7280",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className='usertabledata'>
          <TableContainer className={dataTable.tbodymain} component={Paper}>
            <Table
              sx={{ minWidth: 1000 }}
              aria-label='users list table'
              style={{ borderCollapse: "separate", borderSpacing: "0px 15px" }}
            >
              <TableHead>
                <TableRow>
                  <TableCell align='left'>User</TableCell>
                  <TableCell align='left'>Email</TableCell>
                  <TableCell align='left'>Phone</TableCell>
                  <TableCell align='left'>Role</TableCell>
                  <TableCell align='center'>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody className={dataTable.tbodywrap}>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align='center'>
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((row) => (
                    <TableRow
                      key={row._id}
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
                              alt='User Avatar'
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
                      <TableCell align='left'>
                        <span
                          className='admin-badge'
                          style={{
                            backgroundColor:
                              row.role === "admin"
                                ? "#FEF2F2"
                                : row.role === "licensed-plumber"
                                  ? "#ECFDF5"
                                  : "#EFF6FF",
                            color:
                              row.role === "admin"
                                ? "#EF4444"
                                : row.role === "licensed-plumber"
                                  ? "#10B981"
                                  : "#3B82F6",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                        >
                          {row.role ? row.role.charAt(0).toUpperCase() + row.role.slice(1).replace("-", " ") : "—"}
                        </span>
                      </TableCell>
                      <td style={{ textAlign: "center" }}>
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
                            onClick={() =>
                              navigate(`/admin/users/update-user/${row._id || row.id}`)
                            }
                            style={{ cursor: "pointer", margin: 0 }}
                          >
                            <Icon
                              icon='mdi:pencil-outline'
                              style={{ fontSize: "20px", color: "#fff" }}
                            />
                          </p>
                          <p
                            className={dataTable.delete}
                            onClick={() => handleDeleteClick(row._id)}
                            style={{ cursor: "pointer", margin: 0, backgroundColor: "#ef4444" }}
                          >
                            <img src={del} alt='Delete' style={{ width: "20px" }} />
                          </p>
                        </div>
                      </td>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Stack
            spacing={2}
            justifyContent='center'
            alignItems='center'
            style={{ marginTop: "30px" }}
          >
            <Pagination
              className='pagiWrap'
              count={totalPages}
              page={currentPage}
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
        )}
      </div>

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
          {"Delete User"}
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
            {"Are you sure you want to delete this user?"}
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

export default withRole(Users, ["admin"]);
