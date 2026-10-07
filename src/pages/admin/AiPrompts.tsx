import React from "react";
import { Icon } from "@iconify/react";
import { useAiPrompts } from "./useAiPrompts";
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Pagination,
} from "@mui/material";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import withRole from "../withRole";
import dataTable from "../../components/tables/customTable/datatable.module.scss";
import del from "../../assets/images/ic_outline-delete.png";
import delt from "../../assets/images/delete.png";

function AiPrompts() {
  const {
    prompts,
    loading,
    userUsageList,
    userUsageLoading,
    userPage,
    setUserPage,
    userTotalPages,
    userSearch,
    setUserSearch,
    openModal,
    editingPrompt,
    formData,
    setFormData,
    openDeleteDialog,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSavePrompt,
    handleDeleteClick,
    handleCloseDelete,
    handleDeleteConfirm,
  } = useAiPrompts();

  return (
    <div style={{ position: "relative" }} className="dsp">
      {loading && <LoadingSpinner />}

      <style>{`
        .prompt-add-btn {
          width: auto !important;
          margin-top: 0 !important;
        }
        .settings-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          border: 1px solid #e5e7eb;
        }
        .settings-flex {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }
      `}</style>

      <div className={dataTable.datatablemainwrap}>
        {/* Header */}
        <div
          className="gc-profile-flex"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                color: "#111827",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              AI Assistant Dynamic Prompts
            </h2>
          </div>

          <button
            className="custom-button prompt-add-btn"
            onClick={handleOpenAddModal}
          >
            Add New Prompt
          </button>
        </div>

        {/* User AI Usage Tracker Section */}
        <div className="settings-card" style={{ marginTop: "16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: 600,
                color: "#111827",
              }}
            >
              <Icon
                icon="lucide:user-check"
                style={{
                  verticalAlign: "middle",
                  marginRight: "8px",
                  color: "#3b82f6",
                }}
              />
              User AI Usage & Subscription Tracker
            </h3>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <TextField
                placeholder="Search user by name or email..."
                size="small"
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                  setUserPage(1);
                }}
                sx={{ width: 260 }}
              />
            </div>
          </div>

          {userUsageLoading ? (
            <p style={{ color: "#6b7280" }}>Loading user usage report...</p>
          ) : userUsageList.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No users found.</p>
          ) : (
            <TableContainer component={Paper} elevation={0} style={{ border: "1px solid #e5e7eb" }}>
              <Table sx={{ minWidth: 700 }} size="small">
                <TableHead style={{ backgroundColor: "#f9fafb" }}>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>User</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Role</TableCell>
                    <TableCell style={{ fontWeight: 600 }} align="center">
                      AI Prompts Used
                    </TableCell>
                    <TableCell style={{ fontWeight: 600 }} align="center">
                      Subscription Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userUsageList.map((row) => (
                    <TableRow key={row.userId} hover>
                      <TableCell>
                        <div style={{ fontWeight: 600, color: "#111827" }}>
                          {row.fullName}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6b7280" }}>
                          {row.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          style={{
                            background: "#f3f4f6",
                            color: "#374151",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            fontSize: "12px",
                            textTransform: "capitalize",
                          }}
                        >
                          {row.role}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: "15px",
                            color: "#111827",
                          }}
                        >
                          {row.usedCount}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <span
                          style={{
                            background: row.isSubscribed ? "#dcfce7" : "#fef3c7",
                            color: row.isSubscribed ? "#166534" : "#92400e",
                            padding: "4px 12px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: 600,
                            textTransform: "capitalize",
                          }}
                        >
                          {row.isSubscribed ? `Subscribed (${row.subscriptionStatus})` : "Unsubscribed / Free"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {userTotalPages > 1 && (
            <div style={{ marginTop: "16px", display: "flex", justifyContent: "center" }}>
              <Pagination
                count={userTotalPages}
                page={userPage}
                onChange={(_, val) => setUserPage(val)}
                color="primary"
                size="small"
              />
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Prompt Dialog */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <form onSubmit={handleSavePrompt}>
          <DialogTitle>
            {editingPrompt ? "Edit AI Prompt" : "Add Dynamic AI Prompt"}
          </DialogTitle>
          <DialogContent style={{ display: "flex", flexDirection: "column", gap: "16px", paddingTop: "12px" }}>
            <TextField
              label="Prompt Text"
              multiline
              rows={3}
              value={formData.prompt}
              onChange={(e) =>
                setFormData({ ...formData, prompt: e.target.value })
              }
              placeholder="e.g. How do I fix a leaking faucet in 5 minutes?"
              required
              fullWidth
            />

            <TextField
              label="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              placeholder="General, Plumbing, Maintenance..."
              fullWidth
            />

            <FormControl fullWidth size="small">
              <InputLabel>Target Role</InputLabel>
              <Select
                value={formData.targetRole}
                label="Target Role"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetRole: e.target.value as any,
                  })
                }
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="home-owner">Home Owner</MenuItem>
                <MenuItem value="apprentice">Apprentice</MenuItem>
                <MenuItem value="licensed-plumber">Licensed Plumber</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  color="primary"
                />
              }
              label="Active Prompt"
            />
          </DialogContent>
          <DialogActions style={{ padding: "16px 24px" }}>
            <Button onClick={handleCloseModal} style={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              style={{
                backgroundColor: "#ff8400",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {editingPrompt ? "Update Prompt" : "Add Prompt"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "35px",
            padding: "40px",
            maxWidth: "562px",
          },
        }}
        maxWidth="md"
        fullWidth
        open={openDeleteDialog}
        onClose={handleCloseDelete}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img src={delt} alt="Delete Confirmation" style={{ width: "80px" }} />
        </div>
        <DialogTitle
          style={{
            textAlign: "center",
            fontSize: "28px",
            fontWeight: "700",
          }}
        >
          Delete AI Prompt
        </DialogTitle>
        <DialogContent style={{ textAlign: "center", color: "#676767" }}>
          Are you sure you want to delete this prompt suggestion? This action cannot be undone.
        </DialogContent>
        <DialogActions style={{ justifyContent: "center", gap: "15px", marginTop: "10px" }}>
          <Button
            onClick={handleCloseDelete}
            style={{
              border: "1px solid #ccc",
              borderRadius: "20px",
              padding: "8px 25px",
              textTransform: "none",
              color: "#666",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            style={{
              background: "#EF4444",
              color: "#fff",
              borderRadius: "20px",
              padding: "8px 25px",
              textTransform: "none",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withRole(AiPrompts, ["admin"]);
