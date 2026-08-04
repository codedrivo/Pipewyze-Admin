import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  getEquipmentCategories,
  addEquipmentCategory,
  updateEquipmentCategory,
  deleteEquipmentCategory,
} from "../../service/apis/equipmentCategory.api";

export interface IEquipmentCategory {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export function useEquipmentCategories() {
  const navigate = useNavigate();
  const [categoriesList, setCategoriesList] = useState<IEquipmentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modals / Dialogs states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<IEquipmentCategory | null>(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getEquipmentCategories();
      if (response?.status === 200) {
        setCategoriesList(response.categories || response.data?.categories || []);
      }
    } catch (error) {
      console.error("Failed to load categories", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const validationSchema = yup.object({
    name: yup.string().required("Category Name is required"),
    description: yup.string().optional(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        if (editingCategory) {
          const id = editingCategory._id || editingCategory.id;
          await updateEquipmentCategory(id!, values);
          toast.success("Category updated successfully!");
        } else {
          await addEquipmentCategory(values);
          toast.success("Category added successfully!");
        }

        handleCloseModal();
        fetchCategories();
      } catch (error: any) {
        console.error("Failed to save category", error);
        toast.error(error?.response?.data?.message || "Failed to save category");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    formik.resetForm({
      values: {
        name: "",
        description: "",
      },
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: IEquipmentCategory) => {
    setEditingCategory(cat);
    formik.resetForm({
      values: {
        name: cat.name,
        description: cat.description || "",
      },
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    formik.resetForm();
  };

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setCategoryToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteEquipmentCategory(categoryToDelete);
      toast.success("Category deleted successfully!");
      handleCloseDelete();
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category", error);
      toast.error("Failed to delete category");
    }
  };

  return {
    navigate,
    categoriesList,
    loading,
    submitting,
    isModalOpen,
    editingCategory,
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
