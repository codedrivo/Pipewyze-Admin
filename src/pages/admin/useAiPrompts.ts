import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getAiPrompts,
  addAiPrompt,
  updateAiPrompt,
  deleteAiPrompt,
  getUserAiUsageReport,
} from "../../service/apis/aiPrompt.api";
import { getsettings, savesettings } from "../../service/apis/setting.api";

export interface AiPromptItem {
  id?: string;
  _id?: string;
  prompt: string;
  category: string;
  targetRole: "all" | "home-owner" | "apprentice" | "licensed-plumber";
  isActive: boolean;
  order: number;
}

export interface UserAiUsageItem {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  usedCount: number;
  isSubscribed: boolean;
  subscriptionStatus: string;
  createdAt: string;
}

export function useAiPrompts() {
  const [prompts, setPrompts] = useState<AiPromptItem[]>([]);
  const [loading, setLoading] = useState(false);

  // User AI Usage Report state
  const [userUsageList, setUserUsageList] = useState<UserAiUsageItem[]>([]);
  const [userUsageLoading, setUserUsageLoading] = useState(false);
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [userSearch, setUserSearch] = useState("");

  // Modal states for Prompt CRUD
  const [openModal, setOpenModal] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<AiPromptItem | null>(null);
  const [formData, setFormData] = useState({
    prompt: "",
    category: "General",
    targetRole: "all" as "all" | "home-owner" | "apprentice" | "licensed-plumber",
    isActive: true,
    order: 0,
  });

  // Delete dialog state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const res = await getAiPrompts();
      if (res && res.prompts) {
        setPrompts(res.prompts);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to fetch AI prompts");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserUsageReport = async (page = 1, search = "") => {
    setUserUsageLoading(true);
    try {
      const res = await getUserAiUsageReport(page, 10, search);
      if (res && res.report) {
        setUserUsageList(res.report);
        setUserTotalPages(res.pagination?.totalPages || 1);
      }
    } catch (err: any) {
      console.error("Failed to fetch user AI usage report:", err);
    } finally {
      setUserUsageLoading(false);
    }
  };

  // Settings state (free limit and paywall enable switch)
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [freeLimit, setFreeLimit] = useState<number | string>(5);
  const [enablePaywall, setEnablePaywall] = useState<boolean>(true);

  const fetchSettings = async () => {
    setSettingsLoading(true);
    try {
      const res = await getsettings();
      if (res && res.data) {
        if (res.data.aiFreeLimit !== undefined) {
          setFreeLimit(res.data.aiFreeLimit);
        }
        if (res.data.aiEnablePaywall !== undefined) {
          setEnablePaywall(Boolean(res.data.aiEnablePaywall));
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch AI settings:", err);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleSaveLimitSettings = async () => {
    setSettingsLoading(true);
    try {
      await savesettings({
        aiFreeLimit: Number(freeLimit),
        aiEnablePaywall: enablePaywall,
      });
      toast.success("AI limit settings updated successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save AI limit settings");
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
    fetchSettings();
  }, []);

  useEffect(() => {
    fetchUserUsageReport(userPage, userSearch);
  }, [userPage, userSearch]);

  const handleOpenAddModal = () => {
    setEditingPrompt(null);
    setFormData({
      prompt: "",
      category: "General",
      targetRole: "all",
      isActive: true,
      order: prompts.length,
    });
    setOpenModal(true);
  };

  const handleOpenEditModal = (item: AiPromptItem) => {
    setEditingPrompt(item);
    setFormData({
      prompt: item.prompt,
      category: item.category || "General",
      targetRole: item.targetRole || "all",
      isActive: item.isActive !== undefined ? item.isActive : true,
      order: item.order || 0,
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingPrompt(null);
  };

  const handleSavePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.prompt.trim()) {
      toast.error("Prompt text is required");
      return;
    }

    setLoading(true);
    try {
      if (editingPrompt) {
        const id = editingPrompt._id || editingPrompt.id;
        await updateAiPrompt(id!, formData);
        toast.success("AI Prompt updated successfully");
      } else {
        await addAiPrompt(formData);
        toast.success("AI Prompt added successfully");
      }
      handleCloseModal();
      fetchPrompts();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save AI prompt");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setDeleteId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await deleteAiPrompt(deleteId);
      toast.success("AI Prompt deleted successfully");
      handleCloseDelete();
      fetchPrompts();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete AI prompt");
    } finally {
      setLoading(false);
    }
  };

  return {
    prompts,
    loading,
    settingsLoading,
    freeLimit,
    setFreeLimit,
    enablePaywall,
    setEnablePaywall,
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
    handleSaveLimitSettings,
  };
}


