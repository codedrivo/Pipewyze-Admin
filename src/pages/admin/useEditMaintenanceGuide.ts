import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { getMaintenanceGuide, updateMaintenanceGuide } from "../../service/apis/maintenanceGuide.api";
import { getEssentialTools } from "../../service/apis/essentialTool.api";
import { getPlumbingCodes } from "../../service/apis/plumbingCode.api";
import { IChecklistItem } from "./useAddMaintenanceGuide";

export function useEditMaintenanceGuide() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [toolsList, setToolsList] = useState<any[]>([]);
  const [codesList, setCodesList] = useState<any[]>([]);
  const [checklist, setChecklist] = useState<IChecklistItem[]>([{ task: "", frequency: "" }]);

  useEffect(() => {
    const loadResources = async () => {
      try {
        setLoading(true);
        const [toolsResponse, codesResponse, guideResponse] = await Promise.all([
          getEssentialTools(),
          getPlumbingCodes(),
          getMaintenanceGuide(id!)
        ]);

        if (toolsResponse?.status === 200) {
          setToolsList(toolsResponse.tools || toolsResponse.data?.tools || []);
        }
        if (codesResponse?.status === 200) {
          setCodesList(codesResponse.codes || codesResponse.data?.codes || []);
        }

        if (guideResponse?.status === 200) {
          const guide = guideResponse.guide || guideResponse.data?.guide;
          if (guide) {
            formik.resetForm({
              values: {
                title: guide.title || "",
                brandModel: guide.brandModel || "",
                expectedLife: guide.expectedLife || "",
                difficulty: guide.difficulty || "Intermediate",
                overview: guide.overview || "",
                requiredTools: (guide.requiredTools || []).map((t: any) => typeof t === "object" ? t._id || t.id : t) as string[],
                relatedCodes: (guide.relatedCodes || []).map((c: any) => typeof c === "object" ? c._id || c.id : c) as string[],
                recommendedVideo: guide.recommendedVideo || "",
              }
            });
            setChecklist(guide.checklist || [{ task: "", frequency: "" }]);
            setImagePreview(guide.image || null);
          }
        }
      } catch (error) {
        console.error("Failed to load guide details or dependencies", error);
        toast.error("Failed to load guide details");
      } finally {
        setLoading(false);
      }
    };
    loadResources();
  }, [id]);

  const validationSchema = yup.object({
    title: yup.string().required("Title is required"),
    brandModel: yup.string().optional(),
    expectedLife: yup.string().optional(),
    difficulty: yup.string().optional(),
    overview: yup.string().optional(),
    requiredTools: yup.array().of(yup.string()).optional(),
    relatedCodes: yup.array().of(yup.string()).optional(),
    recommendedVideo: yup.string().optional(),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      brandModel: "",
      expectedLife: "",
      difficulty: "Intermediate",
      overview: "",
      requiredTools: [] as string[],
      relatedCodes: [] as string[],
      recommendedVideo: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);

        const filteredChecklist = checklist.filter(item => item.task.trim() && item.frequency.trim());

        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("brandModel", values.brandModel || "");
        formData.append("expectedLife", values.expectedLife || "");
        formData.append("difficulty", values.difficulty || "Intermediate");
        formData.append("overview", values.overview || "");
        formData.append("recommendedVideo", values.recommendedVideo || "");
        formData.append("checklist", JSON.stringify(filteredChecklist));
        formData.append("requiredTools", JSON.stringify(values.requiredTools));
        formData.append("relatedCodes", JSON.stringify(values.relatedCodes));

        if (imageFile) {
          formData.append("image", imageFile);
        }

        await updateMaintenanceGuide(id!, formData);
        toast.success("Maintenance guide updated successfully!");
        navigate("/admin/maintenance-guides");
      } catch (error: any) {
        console.error("Failed to update maintenance guide", error);
        toast.error(error?.response?.data?.message || "Failed to update maintenance guide");
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

  const addChecklistItem = () => {
    setChecklist([...checklist, { task: "", frequency: "" }]);
  };

  const removeChecklistItem = (index: number) => {
    const updated = checklist.filter((_, i) => i !== index);
    setChecklist(updated.length ? updated : [{ task: "", frequency: "" }]);
  };

  const handleChecklistChange = (index: number, field: keyof IChecklistItem, value: string) => {
    const updated = checklist.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setChecklist(updated);
  };

  const handleCheckboxChange = (field: "requiredTools" | "relatedCodes", toolId: string, checked: boolean) => {
    const currentValues = formik.values[field] as string[];
    if (checked) {
      formik.setFieldValue(field, [...currentValues, toolId]);
    } else {
      formik.setFieldValue(field, currentValues.filter(val => val !== toolId));
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
    toolsList,
    codesList,
    checklist,
    addChecklistItem,
    removeChecklistItem,
    handleChecklistChange,
    handleCheckboxChange,
  };
}
