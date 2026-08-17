import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getTrendingVideos, deleteTrendingVideo, updateTrendingVideo } from "../../service/apis/trendingVideo.api";

export function useAiVideos() {
  const [videosList, setVideosList] = useState<any[]>([]);
  const [availableTrendingVideos, setAvailableTrendingVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);

  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [selectedVideosToImport, setSelectedVideosToImport] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);

  const [importAudienceFilter, setImportAudienceFilter] = useState<string>("all");
  const [audienceFilter, setAudienceFilter] = useState<string>("all");

  const fetchAiVideos = async () => {
    try {
      setLoading(true);
      const response = await getTrendingVideos(undefined, undefined, true);
      if (response?.status === 200) {
        setVideosList(response.videos || response.data?.videos || []);
      }
    } catch (error) {
      console.error("Failed to load AI videos", error);
      toast.error("Failed to load AI videos");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTrendingVideos = async () => {
    try {
      const response = await getTrendingVideos(undefined, undefined, false);
      if (response?.status === 200) {
        setAvailableTrendingVideos(response.videos || response.data?.videos || []);
      }
    } catch (error) {
      console.error("Failed to load available trending videos", error);
    }
  };

  useEffect(() => {
    fetchAiVideos();
  }, []);

  const handleDeleteClick = (id: string) => {
    setVideoToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setVideoToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!videoToDelete) return;
    try {
      setLoading(true);
      await updateTrendingVideo(videoToDelete, { isAiVideo: false });
      toast.success("AI video removed from list successfully!");
      handleCloseDelete();
      fetchAiVideos();
    } catch (error) {
      console.error("Failed to remove AI video", error);
      toast.error("Failed to remove AI video");
      setLoading(false);
    }
  };

  const handleOpenImport = () => {
    fetchAvailableTrendingVideos();
    setSelectedVideosToImport([]);
    setImportAudienceFilter("all");
    setOpenImportDialog(true);
  };

  const handleCloseImport = () => {
    setOpenImportDialog(false);
    setSelectedVideosToImport([]);
  };

  const handleToggleSelectVideo = (id: string) => {
    setSelectedVideosToImport((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleImportConfirm = async () => {
    if (selectedVideosToImport.length === 0) return;
    try {
      setImporting(true);
      for (const id of selectedVideosToImport) {
        await updateTrendingVideo(id, { isAiVideo: true });
      }
      toast.success("Videos imported to AI Video section successfully!");
      handleCloseImport();
      fetchAiVideos();
    } catch (error) {
      console.error("Failed to import videos", error);
      toast.error("Failed to import some videos");
    } finally {
      setImporting(false);
    }
  };

  return {
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
  };
}
