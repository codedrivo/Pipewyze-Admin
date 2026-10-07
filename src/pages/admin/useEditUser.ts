import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { userDetails, updateUser } from "../../service/apis/user.api";
import { VALIDATION_MESSAGES } from "../../utils/message/messages";
import toast from "react-hot-toast";

const normalizeUSPhoneNumber = (value: string) => {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }
  return digits;
};

const formatUSPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

export function useEditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const validationSchema = yup.object({
    fullName: yup.string().required(VALIDATION_MESSAGES.fullNameRequired),
    phone: yup
      .string()
      .required(VALIDATION_MESSAGES.phoneRequired)
      .test(
        "us-phone",
        VALIDATION_MESSAGES.phoneInvalid,
        (value) => normalizeUSPhoneNumber(value || "").length === 10
      ),
    role: yup.string().required(VALIDATION_MESSAGES.roleRequired),
    latitude: yup.number().nullable().optional(),
    longitude: yup.number().nullable().optional(),
    address: yup.string().optional(),
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      phone: "",
      role: "home-owner",
      profileImage: null as File | null,
      latitude: "",
      longitude: "",
      address: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!id) return;
      try {
        setSaving(true);
        const formData = new FormData();
        formData.append("fullName", values.fullName);
        formData.append("phone", normalizeUSPhoneNumber(values.phone));
        formData.append("role", values.role);
        if (values.role === "licensed-plumber") {
          formData.append("latitude", values.latitude || "");
          formData.append("longitude", values.longitude || "");
          formData.append("address", values.address || "");
        }
        if (values.profileImage) {
          formData.append("profileimageurl", values.profileImage);
        }

        await updateUser(id, formData as any);
        toast.success("User updated successfully!");
        navigate("/admin/users");
      } catch (error: any) {
        console.error("Failed to update user", error);
      } finally {
        setSaving(false);
      }
    },
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await userDetails(id);
        const data = res?.userData || res?.data?.userData || {};
        formik.setValues({
          fullName: data.fullName || "",
          phone: formatUSPhoneNumber(data.phone || ""),
          role: data.role || "home-owner",
          profileImage: null,
          latitude: data.latitude !== undefined ? String(data.latitude) : "",
          longitude: data.longitude !== undefined ? String(data.longitude) : "",
          address: data.address || "",
        });
        setEmail(data.email || "");
        setImagePreview(data.profileimageurl || null);
      } catch (error) {
        console.error("Failed to load user details", error);
        toast.error("Failed to load user details");
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue("profileImage", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUSPhoneNumber(e.target.value);
    formik.setFieldValue("phone", formatted);
  };

  return {
    navigate,
    fileInputRef,
    formik,
    email,
    imagePreview,
    loading,
    saving,
    handleImageChange,
    handlePhoneChange,
  };
}
