import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  getEssentialTools,
  addEssentialTool,
  updateEssentialTool,
  deleteEssentialTool,
} from "../../service/apis/essentialTool.api";

export interface IEssentialTool {
  _id: string;
  id?: string;
  name: string;
  description: string;
  tag?: string;
  recommendationLink?: string;
  image?: string;
  purpose?: string;
  bestUsedFor?: string[];
  howToUse?: string[];
  safetyTips?: string[];
  recommendedVideo?: string;
  audience?: string;
  createdAt?: string;
}

export function useEssentialTools() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toolsList, setToolsList] = useState<IEssentialTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modals / Dialogs states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<IEssentialTool | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<string | null>(null);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const response = await getEssentialTools();
      if (response?.status === 200) {
        setToolsList(response.tools || response.data?.tools || []);
      }
    } catch (error) {
      console.error("Failed to load essential tools", error);
      toast.error("Failed to load essential tools");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    tag: yup.string().optional(),
    recommendationLink: yup.string().optional(),
    audience: yup.string().optional(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      tag: "",
      recommendationLink: "",
      audience: "home-owner",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("tag", values.tag || "");
        formData.append("recommendationLink", values.recommendationLink || "");
        formData.append("audience", values.audience || "home-owner");
        if (imageFile) {
          formData.append("image", imageFile);
        }

        if (editingTool) {
          const id = editingTool._id || editingTool.id;
          await updateEssentialTool(id!, formData);
          toast.success("Essential tool updated successfully!");
        } else {
          await addEssentialTool(formData);
          toast.success("Essential tool added successfully!");
        }

        handleCloseModal();
        fetchTools();
      } catch (error: any) {
        console.error("Failed to save essential tool", error);
        toast.error(error?.response?.data?.message || "Failed to save essential tool");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleOpenAddModal = () => {
    setEditingTool(null);
    setImagePreview(null);
    setImageFile(null);
    formik.resetForm({
      values: {
        name: "",
        description: "",
        tag: "",
        recommendationLink: "",
        audience: "home-owner",
      },
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tool: IEssentialTool) => {
    setEditingTool(tool);
    setImagePreview(tool.image || null);
    setImageFile(null);
    formik.resetForm({
      values: {
        name: tool.name,
        description: tool.description,
        tag: tool.tag || "",
        recommendationLink: tool.recommendationLink || "",
        audience: tool.audience || "home-owner",
      },
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTool(null);
    setImagePreview(null);
    setImageFile(null);
    formik.resetForm();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteClick = (id: string) => {
    setToolToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setToolToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!toolToDelete) return;
    try {
      await deleteEssentialTool(toolToDelete);
      toast.success("Essential tool deleted successfully!");
      handleCloseDelete();
      fetchTools();
    } catch (error) {
      console.error("Failed to delete tool", error);
      toast.error("Failed to delete essential tool");
    }
  };

  return {
    fileInputRef,
    toolsList,
    loading,
    submitting,
    isModalOpen,
    editingTool,
    imagePreview,
    openDeleteDialog,
    formik,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
    handleImageChange,
    handleDeleteClick,
    handleCloseDelete,
    handleDeleteConfirm,
  };
}
