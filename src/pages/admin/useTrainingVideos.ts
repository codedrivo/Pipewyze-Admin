import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getTrainingVideos, deleteTrainingVideo } from "../../service/apis/trainingVideo.api";

export function useTrainingVideos() {
  const { audience } = useParams<{ audience: string }>();
  const [videosList, setVideosList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await getTrainingVideos(audience);
      if (response?.status === 200) {
        setVideosList(response.videos || response.data?.videos || []);
      }
    } catch (error) {
      console.error("Failed to load training videos", error);
      toast.error("Failed to load training videos");
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
      await deleteTrainingVideo(videoToDelete);
      toast.success("Training video deleted successfully!");
      handleCloseDelete();
      fetchVideos();
    } catch (error) {
      console.error("Failed to delete training video", error);
      toast.error("Failed to delete training video");
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
