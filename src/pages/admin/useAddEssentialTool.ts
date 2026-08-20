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

  const [bestUsedFor, setBestUsedFor] = useState<string[]>([""]);
  const [howToUse, setHowToUse] = useState<string[]>([""]);
  const [safetyTips, setSafetyTips] = useState<string[]>([""]);

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    tag: yup.string().optional(),
    recommendationLink: yup.string().optional(),
    purpose: yup.string().optional(),
    recommendedVideo: yup.string().optional(),
    audience: yup.string().required("Audience is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      tag: "",
      recommendationLink: "",
      purpose: "",
      recommendedVideo: "",
      audience: "home-owner",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);

        const filteredBestUsedFor = bestUsedFor.map(s => s.trim()).filter(Boolean);
        const filteredHowToUse = howToUse.map(s => s.trim()).filter(Boolean);
        const filteredSafetyTips = safetyTips.map(s => s.trim()).filter(Boolean);

        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("tag", values.tag || "");
        formData.append("recommendationLink", values.recommendationLink || "");
        formData.append("purpose", values.purpose || "");
        formData.append("recommendedVideo", values.recommendedVideo || "");
        formData.append("audience", values.audience);
        formData.append("bestUsedFor", JSON.stringify(filteredBestUsedFor));
        formData.append("howToUse", JSON.stringify(filteredHowToUse));
        formData.append("safetyTips", JSON.stringify(filteredSafetyTips));

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

  // Helper functions for dynamic lists
  const handleListChange = (
    listType: "bestUsedFor" | "howToUse" | "safetyTips",
    index: number,
    value: string
  ) => {
    if (listType === "bestUsedFor") {
      const updated = [...bestUsedFor];
      updated[index] = value;
      setBestUsedFor(updated);
    } else if (listType === "howToUse") {
      const updated = [...howToUse];
      updated[index] = value;
      setHowToUse(updated);
    } else if (listType === "safetyTips") {
      const updated = [...safetyTips];
      updated[index] = value;
      setSafetyTips(updated);
    }
  };

  const addListItem = (listType: "bestUsedFor" | "howToUse" | "safetyTips") => {
    if (listType === "bestUsedFor") {
      setBestUsedFor([...bestUsedFor, ""]);
    } else if (listType === "howToUse") {
      setHowToUse([...howToUse, ""]);
    } else if (listType === "safetyTips") {
      setSafetyTips([...safetyTips, ""]);
    }
  };

  const removeListItem = (listType: "bestUsedFor" | "howToUse" | "safetyTips", index: number) => {
    if (listType === "bestUsedFor") {
      const updated = bestUsedFor.filter((_, i) => i !== index);
      setBestUsedFor(updated.length ? updated : [""]);
    } else if (listType === "howToUse") {
      const updated = howToUse.filter((_, i) => i !== index);
      setHowToUse(updated.length ? updated : [""]);
    } else if (listType === "safetyTips") {
      const updated = safetyTips.filter((_, i) => i !== index);
      setSafetyTips(updated.length ? updated : [""]);
    }
  };

  return {
    navigate,
    fileInputRef,
    submitting,
    imagePreview,
    formik,
    handleImageChange,
    bestUsedFor,
    howToUse,
    safetyTips,
    handleListChange,
    addListItem,
    removeListItem,
  };
}
