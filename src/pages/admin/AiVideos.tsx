import React from "react";
import { Icon } from "@iconify/react";
import { useAiVideos } from "./useAiVideos";
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
  Checkbox,
} from "@mui/material";
import LoadingSpinner from "../../components/UI/loadingSpinner/LoadingSpinner";
import withRole from "../withRole";
import dataTable from "../../components/tables/customTable/datatable.module.scss";
import del from "../../assets/images/ic_outline-delete.png";
import delt from "../../assets/images/delete.png";

function AiVideos() {
  const navigate = useNavigate();
  const {
    videosList,
    availableTrendingVideos,
    loading,
    openDeleteDialog,
    handleDeleteClick,
    handleCloseDelete,
    handleDeleteConfirm,
    openImportDialog,
    selectedVideosToImport,
    importing,
    handleOpenImport,
    handleCloseImport,
    handleToggleSelectVideo,
    handleImportConfirm,
    importAudienceFilter,
    setImportAudienceFilter,
    audienceFilter,
    setAudienceFilter,
  } = useAiVideos();

  const filteredAvailableVideos = availableTrendingVideos.filter((video) =>
    importAudienceFilter === "all" ? true : video.targetAudience === importAudienceFilter
  );

  const filteredVideosList = videosList.filter((video) =>
    audienceFilter === "all" ? true : video.targetAudience === audienceFilter
  );

  return (
    <div style={{ position: "relative" }} className='dsp'>
      {loading || importing ? <LoadingSpinner /> : null}

      <style>{`
        .guide-add-btn {
          width: auto !important;
          margin-top: 0 !important;
        }
      `}</style>

      <div className={dataTable.datatablemainwrap}>
        {/* Header */}
        <div className='gc-profile-flex' style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <h2 style={{ margin: 0, fontSize: "24px", color: "#111827", fontFamily: "'DM Sans', sans-serif" }}>
              AI Videos
            </h2>
            <select
              value={audienceFilter}
              onChange={(e) => setAudienceFilter(e.target.value)}
              style={{
                fontSize: "14px",
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outline: "none",
                cursor: "pointer",
                backgroundColor: "#fff"
              }}
            >
              <option value="all">All Audiences</option>
              <option value="apprentice">Apprentice</option>
              <option value="licensed-plumber">Licensed Plumber</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button className='custom-button guide-add-btn' style={{ backgroundColor: "#10B981" }} onClick={handleOpenImport}>
              Select from Trending Videos
            </button>
          </div>
        </div>

        {/* Content Area */}
        {filteredVideosList.length === 0 ? (
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
              No AI videos registered yet
            </p>
          </div>
        ) : (
          <div className='usertabledata'>
            <TableContainer className={dataTable.tbodymain} component={Paper}>
              <Table
                sx={{ minWidth: 1000 }}
                aria-label='ai videos list table'
                style={{ borderCollapse: "separate", borderSpacing: "0px 15px" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align='left'>Thumbnail</TableCell>
                    <TableCell align='left'>Title</TableCell>
                    <TableCell align='left'>Video URL</TableCell>
                    <TableCell align='left'>Target Audience</TableCell>
                    <TableCell align='left'>Description</TableCell>
                    <TableCell align='center'>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody className={dataTable.tbodywrap}>
                  {filteredVideosList.map((row) => (
                    <TableRow
                      key={row.id || row._id}
                      sx={{
                        "& > *": { borderBottom: "unset" }
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
                        <span style={{
                          display: "inline-block",
                          whiteSpace: "nowrap",
                          textTransform: "capitalize",
                          backgroundColor: row.targetAudience === "licensed-plumber" ? "#eff6ff" : "#f0fdf4",
                          color: row.targetAudience === "licensed-plumber" ? "#1e40af" : "#166534",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: 600,
                          textAlign: "center"
                        }}>
                          {row.targetAudience === "licensed-plumber" ? "Licensed Plumber" : "Apprentice"}
                        </span>
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
      >
        <div className={dataTable.modalimg} style={{ textAlign: "center", marginBottom: "20px" }}>
          <img src={delt} alt='Delete Confirmation' style={{ width: "80px" }} />
        </div>
        <DialogTitle
          style={{
            textAlign: "center",
            fontSize: "32px",
            color: "#000",
            fontWeight: "700",
          }}
        >
          {"Remove AI Video"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            style={{
              textAlign: "center",
              color: "#676767",
              fontSize: "16px",
            }}
          >
            {"Are you sure you want to remove this video from the AI Videos list? (It will still remain in the Trending Videos library)"}
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center", gap: "15px", marginTop: "10px" }}>
          <Button onClick={handleCloseDelete} className='btn-cancel' style={{ border: "1px solid #ccc", borderRadius: "20px", padding: "8px 25px", textTransform: "none", color: "#666" }}>
            {"Cancel"}
          </Button>
          <Button onClick={handleDeleteConfirm} className='btn' style={{ background: "#EF4444", color: "#fff", borderRadius: "20px", padding: "8px 25px", textTransform: "none" }}>
            {"Remove"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import from Trending Videos Dialog */}
      <Dialog
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "35px",
            padding: "30px",
            maxWidth: "650px",
          },
        }}
        maxWidth='md'
        fullWidth
        open={openImportDialog}
        onClose={handleCloseImport}
      >
        <DialogTitle
          style={{
            fontSize: "24px",
            color: "#000",
            fontWeight: "700",
            paddingBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{"Select from Trending Videos"}</span>
          <select
            value={importAudienceFilter}
            onChange={(e) => setImportAudienceFilter(e.target.value)}
            style={{
              fontSize: "14px",
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="all">All Audiences</option>
            <option value="apprentice">Apprentice</option>
            <option value="licensed-plumber">Licensed Plumber</option>
          </select>
        </DialogTitle>
        <DialogContent style={{ maxHeight: "400px", overflowY: "auto" }}>
          {filteredAvailableVideos.length === 0 ? (
            <p style={{ color: "#666", textAlign: "center", marginTop: "20px" }}>
              No available trending videos to import for this filter.
            </p>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width="50px">Select</TableCell>
                    <TableCell>Thumbnail</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Audience</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAvailableVideos.map((video) => {
                    const isSelected = selectedVideosToImport.includes(video._id || video.id);
                    return (
                      <TableRow key={video._id || video.id}>
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleToggleSelectVideo(video._id || video.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <img
                            src={video.thumbnail || "/no_image.png"}
                            alt={video.title}
                            style={{ width: "40px", height: "40px", borderRadius: "4px", objectFit: "cover" }}
                          />
                        </TableCell>
                        <TableCell style={{ fontWeight: 600 }}>{video.title}</TableCell>
                        <TableCell style={{ textTransform: "capitalize" }}>
                          <span style={{
                            display: "inline-block",
                            whiteSpace: "nowrap",
                            backgroundColor: video.targetAudience === "licensed-plumber" ? "#eff6ff" : "#f0fdf4",
                            color: video.targetAudience === "licensed-plumber" ? "#1e40af" : "#166534",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: 600,
                            textAlign: "center"
                          }}>
                            {video.targetAudience === "licensed-plumber" ? "Licensed Plumber" : "Apprentice"}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions style={{ justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
          <Button onClick={handleCloseImport} style={{ border: "1px solid #ccc", borderRadius: "20px", padding: "6px 20px", textTransform: "none", color: "#666" }}>
            {"Cancel"}
          </Button>
          <Button
            onClick={handleImportConfirm}
            disabled={selectedVideosToImport.length === 0 || importing}
            style={{
              background: selectedVideosToImport.length === 0 ? "#ccc" : "#10B981",
              color: "#fff",
              borderRadius: "20px",
              padding: "6px 20px",
              textTransform: "none"
            }}
          >
            {"Import Selected"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withRole(AiVideos, ["admin"]);
