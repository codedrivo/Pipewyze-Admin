import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  getPlumbingCodes,
  addPlumbingCode,
  updatePlumbingCode,
  deletePlumbingCode,
} from "../../service/apis/plumbingCode.api";

export interface IPlumbingCode {
  _id: string;
  id?: string;
  code: string;
  title: string;
  category: "MUPC" | "IPC";
  description: string;
  exception?: string;
  plainLanguageInterpretation: string;
  categoryFullName?: string;
  createdAt?: string;
}

export function usePlumbingCodes() {
  const [codesList, setCodesList] = useState<IPlumbingCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modals / Dialogs states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<IPlumbingCode | null>(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [codeToDelete, setCodeToDelete] = useState<string | null>(null);

  const fetchCodes = async () => {
    try {
      setLoading(true);
      const response = await getPlumbingCodes();
      if (response?.status === 200) {
        setCodesList(response.codes || response.data?.codes || []);
      }
    } catch (error) {
      console.error("Failed to load plumbing codes", error);
      toast.error("Failed to load plumbing codes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const validationSchema = yup.object({
    code: yup.string().required("Code Identifier (e.g. 248 CMR 10.05) is required"),
    title: yup.string().required("Title is required"),
    category: yup.string().oneOf(["MUPC", "IPC"]).required("Category is required"),
    description: yup.string().required("Description is required"),
    exception: yup.string().optional(),
    plainLanguageInterpretation: yup.string().required("Plain Language Interpretation is required"),
  });

  const formik = useFormik({
    initialValues: {
      code: "",
      title: "",
      category: "MUPC" as "MUPC" | "IPC",
      description: "",
      exception: "",
      plainLanguageInterpretation: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        if (editingCode) {
          const id = editingCode._id || editingCode.id;
          await updatePlumbingCode(id!, values);
          toast.success("Plumbing code updated successfully!");
        } else {
          await addPlumbingCode(values);
          toast.success("Plumbing code added successfully!");
        }

        handleCloseModal();
        fetchCodes();
      } catch (error: any) {
        console.error("Failed to save plumbing code", error);
        toast.error(error?.response?.data?.message || "Failed to save plumbing code");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleOpenAddModal = () => {
    setEditingCode(null);
    formik.resetForm({
      values: {
        code: "",
        title: "",
        category: "MUPC",
        description: "",
        exception: "",
        plainLanguageInterpretation: "",
      },
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (codeItem: IPlumbingCode) => {
    setEditingCode(codeItem);
    formik.resetForm({
      values: {
        code: codeItem.code,
        title: codeItem.title,
        category: codeItem.category,
        description: codeItem.description,
        exception: codeItem.exception || "",
        plainLanguageInterpretation: codeItem.plainLanguageInterpretation,
      },
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCode(null);
    formik.resetForm();
  };

  const handleDeleteClick = (id: string) => {
    setCodeToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setCodeToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!codeToDelete) return;
    try {
      await deletePlumbingCode(codeToDelete);
      toast.success("Plumbing code deleted successfully!");
      handleCloseDelete();
      fetchCodes();
    } catch (error) {
      console.error("Failed to delete plumbing code", error);
      toast.error("Failed to delete plumbing code");
    }
  };

  return {
    codesList,
    loading,
    submitting,
    isModalOpen,
    editingCode,
    openDeleteDialog,
    formik,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
    handleDeleteClick,
    handleCloseDelete,
    handleDeleteConfirm,
  };
}
