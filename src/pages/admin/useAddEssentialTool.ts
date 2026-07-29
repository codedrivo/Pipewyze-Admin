import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { addEssentialTool } from "../../service/apis/essentialTool.api";

export function useAddEssentialTool() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    tag: yup.string().optional(),
    recommendationLink: yup.string().optional(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      tag: "",
      recommendationLink: "",
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
        if (imageFile) {
          formData.append("image", imageFile);
        }

        await addEssentialTool(formData);
        toast.success("Essential tool added successfully!");
        navigate("/admin/essential-tools");
      } catch (error: any) {
        console.error("Failed to save essential tool", error);
        toast.error(error?.response?.data?.message || "Failed to save essential tool");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return {
    navigate,
    fileInputRef,
    submitting,
    imagePreview,
    formik,
    handleImageChange,
  };
}
