import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { addUser } from "../../service/apis/user.api";
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

export function useAddUser() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validationSchema = yup.object({
    fullName: yup.string().required(VALIDATION_MESSAGES.fullNameRequired),
    email: yup
      .string()
      .email(VALIDATION_MESSAGES.emailInvalid)
      .required(VALIDATION_MESSAGES.emailRequired),
    phone: yup
      .string()
      .required(VALIDATION_MESSAGES.phoneRequired)
      .test(
        "us-phone",
        VALIDATION_MESSAGES.phoneInvalid,
        (value) => normalizeUSPhoneNumber(value || "").length === 10
      ),
    role: yup.string().required(VALIDATION_MESSAGES.roleRequired),
    password: yup
      .string()
      .required(VALIDATION_MESSAGES.passwordRequired)
      .min(8, VALIDATION_MESSAGES.passwordMinLength)
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        VALIDATION_MESSAGES.passwordComplexity
      ),
    latitude: yup.number().nullable().optional(),
    longitude: yup.number().nullable().optional(),
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      role: "home-owner",
      password: "",
      profileImage: null as File | null,
      latitude: "",
      longitude: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("fullName", values.fullName);
        formData.append("email", values.email);
        formData.append("phone", normalizeUSPhoneNumber(values.phone));
        formData.append("role", values.role);
        formData.append("password", values.password);
        if (values.role === "licensed-plumber") {
          formData.append("latitude", values.latitude || "");
          formData.append("longitude", values.longitude || "");
        }
        if (values.profileImage) {
          formData.append("profileimageurl", values.profileImage);
        }

        await addUser(formData as any);
        toast.success("User created successfully!");
        navigate("/admin/users");
      } catch (error: any) {
        console.error("Failed to add user", error);
      } finally {
        setLoading(false);
      }
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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
    imagePreview,
    loading,
    showPassword,
    togglePasswordVisibility,
    handleImageChange,
    handlePhoneChange,
  };
}
