import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getTrendingVideos, deleteTrendingVideo } from "../../service/apis/trendingVideo.api";

export function useTrendingVideos() {
  const { audience } = useParams<{ audience: string }>();
  const [videosList, setVideosList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await getTrendingVideos(audience);
      if (response?.status === 200) {
        setVideosList(response.videos || response.data?.videos || []);
      }
    } catch (error) {
      console.error("Failed to load trending videos", error);
      toast.error("Failed to load trending videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [audience]);

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
      await deleteTrendingVideo(videoToDelete);
      toast.success("Trending video deleted successfully!");
      handleCloseDelete();
      fetchVideos();
    } catch (error) {
      console.error("Failed to delete trending video", error);
      toast.error("Failed to delete trending video");
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
    audience,
  };
}
