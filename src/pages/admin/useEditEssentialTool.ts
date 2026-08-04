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

  const [bestUsedFor, setBestUsedFor] = useState<string[]>([""]);
  const [howToUse, setHowToUse] = useState<string[]>([""]);
  const [safetyTips, setSafetyTips] = useState<string[]>([""]);

  const fetchToolDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await getEssentialTool(id);
      if (response?.status === 200) {
        const tool = response.tool || response.data?.tool;
        setImagePreview(tool.image || null);
        
        formik.resetForm({
          values: {
            name: tool.name || "",
            description: tool.description || "",
            tag: tool.tag || "",
            recommendationLink: tool.recommendationLink || "",
            purpose: tool.purpose || "",
            recommendedVideo: tool.recommendedVideo || "",
          },
        });

        setBestUsedFor(tool.bestUsedFor?.length ? tool.bestUsedFor : [""]);
        setHowToUse(tool.howToUse?.length ? tool.howToUse : [""]);
        setSafetyTips(tool.safetyTips?.length ? tool.safetyTips : [""]);
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
    purpose: yup.string().optional(),
    recommendedVideo: yup.string().optional(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      tag: "",
      recommendationLink: "",
      purpose: "",
      recommendedVideo: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!id) return;
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
        formData.append("bestUsedFor", JSON.stringify(filteredBestUsedFor));
        formData.append("howToUse", JSON.stringify(filteredHowToUse));
        formData.append("safetyTips", JSON.stringify(filteredSafetyTips));

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
    loading,
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
