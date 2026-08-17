import React from "react";
import { Icon } from "@iconify/react";
import { useTrendingVideos } from "./useTrendingVideos";
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

function TrendingVideos() {
  const navigate = useNavigate();
  const {
    videosList,
    loading,
    openDeleteDialog,
    handleDeleteClick,
    handleCloseDelete,
    handleDeleteConfirm,
    audience,
  } = useTrendingVideos();

  const formattedAudience = audience === "licensed-plumber" ? "Licensed Plumber" : "Apprentice";

  return (
    <div style={{ position: "relative" }} className='dsp'>
      {loading ? <LoadingSpinner /> : null}

      <style>{`
        .guide-add-btn {
          width: auto !important;
          margin-top: 0 !important;
        }
      `}</style>

      <div className={dataTable.datatablemainwrap}>
        {/* Header */}
        <div className='gc-profile-flex' style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 style={{ margin: 0, fontSize: "24px", color: "#111827", fontFamily: "'DM Sans', sans-serif" }}>
              Trending Videos ({formattedAudience})
            </h2>
          </div>

          <button className='custom-button guide-add-btn' onClick={() => navigate(`/admin/trending-videos/${audience}/add`)}>
            Add Video
          </button>
        </div>

        {/* Content Area */}
        {videosList.length === 0 ? (
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
            <Icon icon='lucide:video' style={{ fontSize: "48px", color: "#9ca3af", marginBottom: "12px" }} />
            <p style={{ color: "#4b5563", fontSize: "16px", fontWeight: 500, margin: 0 }}>
              No trending videos registered yet
            </p>
          </div>
        ) : (
          <div className='usertabledata'>
            <TableContainer className={dataTable.tbodymain} component={Paper}>
              <Table
                sx={{ minWidth: 1000 }}
                aria-label='trending videos list table'
                style={{ borderCollapse: "separate", borderSpacing: "0px 15px" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align='left'>Thumbnail</TableCell>
                    <TableCell align='left'>Title</TableCell>
                    <TableCell align='left'>Video URL</TableCell>
                    <TableCell align='left'>Description</TableCell>
                    <TableCell align='center'>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody className={dataTable.tbodywrap}>
                  {videosList.map((row) => (
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
                            src={row.thumbnail || "/no_image.png"}
                            alt={row.title}
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
                        <div style={{ fontWeight: "bold", color: "#1f2937" }}>
                          {row.title}
                        </div>
                      </TableCell>
                      <TableCell align='left'>
                        <div style={{ color: "#2563eb", textDecoration: "underline", wordBreak: "break-all" }}>
                          <a href={row.videoUrl} target="_blank" rel="noopener noreferrer">
                            {row.videoUrl}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell align='left'>
                        <div style={{ color: "#4b5563", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
                            onClick={() => navigate(`/admin/trending-videos/${audience}/edit/${row._id || row.id}`)}
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
          {"Delete Trending Video"}
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
            {"Are you sure you want to delete this trending video? This action cannot be undone."}
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

export default withRole(TrendingVideos, ["admin"]);
