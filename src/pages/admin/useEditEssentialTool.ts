import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { getEssentialTool, updateEssentialTool } from "../../service/apis/essentialTool.api";
import { IEssentialTool } from "./useEssentialTools";

export function useEditEssentialTool() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [toolDetails, setToolDetails] = useState<IEssentialTool | null>(null);

  const fetchToolDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await getEssentialTool(id);
      if (response?.status === 200) {
        const tool = response.tool || response.data?.tool;
        setToolDetails(tool);
        setImagePreview(tool.image || null);
        formik.resetForm({
          values: {
            name: tool.name || "",
            description: tool.description || "",
            tag: tool.tag || "",
            recommendationLink: tool.recommendationLink || "",
          },
        });
      }
    } catch (error) {
      console.error("Failed to load tool details", error);
      toast.error("Failed to load tool details");
      navigate("/admin/essential-tools");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToolDetails();
  }, [id]);

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
      if (!id) return;
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

        await updateEssentialTool(id, formData);
        toast.success("Essential tool updated successfully!");
        navigate("/admin/essential-tools");
      } catch (error: any) {
        console.error("Failed to update essential tool", error);
        toast.error(error?.response?.data?.message || "Failed to update essential tool");
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
    loading,
    submitting,
    imagePreview,
    formik,
    handleImageChange,
  };
}
