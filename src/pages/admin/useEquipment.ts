import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  getPlumberEquipment,
  addEquipment,
  updateEquipment,
  deleteEquipment,
  getHomeOwnerEquipment,
} from "../../service/apis/equipment.api";
import { getEquipmentCategories } from "../../service/apis/equipmentCategory.api";
import { userDetails, userApi } from "../../service/apis/user.api";

export interface IEquipment {
  _id: string;
  id?: string;
  plumberId?: string;
  ownerId?: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
  };
  category: string;
  brand: string;
  model: string;
  serialNumber?: string;
  installationDate?: string;
  nextServiceDate?: string;
  image?: string;
  createdAt?: string;
}

export function useEquipment() {
  const { plumberId: paramPlumberId } = useParams<{ plumberId: string }>();
  const user = useSelector((state: RootState) => state.authSlice.user);
  
  const [plumbersList, setPlumbersList] = useState<any[]>([]);
  const [selectedPlumberId, setSelectedPlumberId] = useState<string>("");
  
  const plumberId = paramPlumberId || selectedPlumberId || (user?.role === "licensed-plumber" ? user?._id : undefined);
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [equipmentList, setEquipmentList] = useState<IEquipment[]>([]);
  const [plumberName, setPlumberName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  // Modals / Dialogs states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<IEquipment | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await getEquipmentCategories();
      if (response?.status === 200) {
        setCategories(response.categories || response.data?.categories || []);
      }
    } catch (error) {
      console.error("Failed to load equipment categories", error);
    }
  };

  const fetchPlumberInfo = async () => {
    if (!plumberId) return;
    try {
      const response = await userDetails(plumberId);
      if (response?.status === 200) {
        const u = response.userData || response.data?.userData;
        setPlumberName(u?.fullName || `${u?.firstName || ""} ${u?.lastName || ""}`.trim() || "Plumber");
      }
    } catch (error) {
      console.error("Failed to load plumber details", error);
    }
  };
  const fetchEquipment = async () => {
    try {
      setLoading(true);
      if (user?.role === "admin") {
        const response = await getHomeOwnerEquipment();
        if (response?.status === 200) {
          setEquipmentList(response.equipment || response.data?.equipment || []);
        }
      } else {
        if (!plumberId) return;
        const response = await getPlumberEquipment(plumberId);
        if (response?.status === 200) {
          setEquipmentList(response.equipment || response.data?.equipment || []);
        }
      }
    } catch (error) {
      console.error("Failed to load equipment list", error);
      toast.error("Failed to load equipment");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlumbers = async () => {
    try {
      const response = await userApi({ currentPage: 1, limit: 100, role: "licensed-plumber" });
      if (response?.status === 200) {
        const rawUsers = response.users?.users || response.data?.users || response.users || [];
        setPlumbersList(rawUsers);
      }
    } catch (error) {
      console.error("Failed to fetch plumbers", error);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchPlumbers();
    }
  }, [user]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchEquipment();
    } else if (plumberId) {
      fetchPlumberInfo();
      fetchEquipment();
    } else {
      setLoading(false);
    }
  }, [plumberId, user]);

  useEffect(() => {
    if (location.state && (location.state as any).openAddModal) {
      setIsModalOpen(true);
      setEditingEquipment(null);
    }
  }, [location]);

  const validationSchema = yup.object({
    category: yup.string().required("Category is required"),
    brand: yup.string().required("Brand is required"),
    model: yup.string().required("Model is required"),
    serialNumber: yup.string().required("Serial Number is required"),
    installationDate: yup.string().required("Installation Date is required"),
    nextServiceDate: yup.string().required("Next Service Date is required"),
  });

  const formik = useFormik({
    initialValues: {
      category: "",
      brand: "",
      model: "",
      serialNumber: "",
      installationDate: "",
      nextServiceDate: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!plumberId) return;
      try {
        setSubmitting(true);
        const formData = new FormData();
        if (!editingEquipment) {
          formData.append("plumberId", plumberId);
        }
        formData.append("category", values.category);
        formData.append("brand", values.brand);
        formData.append("model", values.model);
        formData.append("serialNumber", values.serialNumber);
        formData.append("installationDate", values.installationDate);
        formData.append("nextServiceDate", values.nextServiceDate);
        if (imageFile) {
          formData.append("image", imageFile);
        }

        if (editingEquipment) {
          const eqId = (editingEquipment as any).id || (editingEquipment as any)._id;
          await updateEquipment(eqId, formData);
          toast.success("Equipment updated successfully!");
        } else {
          await addEquipment(formData);
          toast.success("Equipment added successfully!");
        }

        handleCloseModal();
        fetchEquipment();
      } catch (error: any) {
        console.error("Failed to save equipment", error);
        toast.error(error?.response?.data?.message || "Failed to save equipment");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleOpenAddModal = () => {
    setEditingEquipment(null);
    setImagePreview(null);
    setImageFile(null);
    formik.resetForm({
      values: {
        category: categories[0]?.name || "",
        brand: "",
        model: "",
        serialNumber: "",
        installationDate: "",
        nextServiceDate: "",
      },
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (eq: IEquipment) => {
    setEditingEquipment(eq);
    setImagePreview(eq.image || null);
    setImageFile(null);
    formik.resetForm({
      values: {
        category: eq.category,
        brand: eq.brand || "",
        model: eq.model || "",
        serialNumber: eq.serialNumber || "",
        installationDate: eq.installationDate ? new Date(eq.installationDate).toISOString().split("T")[0] : "",
        nextServiceDate: eq.nextServiceDate ? new Date(eq.nextServiceDate).toISOString().split("T")[0] : "",
      },
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEquipment(null);
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
    setEquipmentToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setEquipmentToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!equipmentToDelete) return;
    try {
      await deleteEquipment(equipmentToDelete);
      toast.success("Equipment deleted successfully!");
      handleCloseDelete();
      fetchEquipment();
    } catch (error) {
      console.error("Failed to delete equipment", error);
      toast.error("Failed to delete equipment");
    }
  };

  return {
    navigate,
    plumberId,
    fileInputRef,
    equipmentList,
    plumberName,
    loading,
    submitting,
    isModalOpen,
    editingEquipment,
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
    plumbersList,
    selectedPlumberId,
    setSelectedPlumberId,
    paramPlumberId,
    categories,
  };
}
