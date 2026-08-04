import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getMaintenanceGuides, deleteMaintenanceGuide } from "../../service/apis/maintenanceGuide.api";

export function useMaintenanceGuides() {
  const [guidesList, setGuidesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [guideToDelete, setGuideToDelete] = useState<string | null>(null);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await getMaintenanceGuides();
      if (response?.status === 200) {
        setGuidesList(response.guides || response.data?.guides || []);
      }
    } catch (error) {
      console.error("Failed to load maintenance guides", error);
      toast.error("Failed to load maintenance guides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  const handleDeleteClick = (id: string) => {
    setGuideToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setGuideToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!guideToDelete) return;
    try {
      setLoading(true);
      await deleteMaintenanceGuide(guideToDelete);
      toast.success("Maintenance guide deleted successfully!");
      handleCloseDelete();
      fetchGuides();
    } catch (error) {
      console.error("Failed to delete maintenance guide", error);
      toast.error("Failed to delete maintenance guide");
      setLoading(false);
    }
  };

  return {
    guidesList,
    loading,
    openDeleteDialog,
    handleDeleteClick,
    handleCloseDelete,
    handleDeleteConfirm,
  };
}
