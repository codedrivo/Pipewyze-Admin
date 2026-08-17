import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getAiVideos, deleteAiVideo } from "../../service/apis/aiVideo.api";

export function useAiVideos() {
  const [videosList, setVideosList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
  const [audienceFilter, setAudienceFilter] = useState<string>("all");

  const fetchVideos = async () => {
    try {
      setLoading(true);
      // Fetch all videos
      const response = await getAiVideos();
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

  useEffect(() => {
    fetchVideos();
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
      await deleteAiVideo(videoToDelete);
      toast.success("AI Video deleted successfully!");
      handleCloseDelete();
      fetchVideos();
    } catch (error) {
      console.error("Failed to delete AI video", error);
      toast.error("Failed to delete AI video");
      setLoading(false);
    }
  };

  return {
    videosList,
    loading,
    openDeleteDialog,
    handleDeleteClick,
    handleCloseDelete,
    handleDeleteConfirm,
    audienceFilter,
    setAudienceFilter,
  };
}
