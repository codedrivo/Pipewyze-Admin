import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { addMaintenanceGuide } from "../../service/apis/maintenanceGuide.api";
import { getEssentialTools } from "../../service/apis/essentialTool.api";
import { getPlumbingCodes } from "../../service/apis/plumbingCode.api";
import { getHomeOwnerEquipment } from "../../service/apis/equipment.api";

export interface IChecklistItem {
  task: string;
  frequency: string;
  checked?: boolean;
}

export function useAddMaintenanceGuide() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [toolsList, setToolsList] = useState<any[]>([]);
  const [codesList, setCodesList] = useState<any[]>([]);
  const [equipmentsList, setEquipmentsList] = useState<any[]>([]);
  const [checklist, setChecklist] = useState<IChecklistItem[]>([{ task: "", frequency: "", checked: false }]);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const [toolsResponse, codesResponse, equipResponse] = await Promise.all([
          getEssentialTools(),
          getPlumbingCodes(),
          getHomeOwnerEquipment()
        ]);
        if (toolsResponse?.status === 200) {
          setToolsList(toolsResponse.tools || toolsResponse.data?.tools || []);
        }
        if (codesResponse?.status === 200) {
          setCodesList(codesResponse.codes || codesResponse.data?.codes || []);
        }
        if (equipResponse?.status === 200) {
          setEquipmentsList(equipResponse.equipment || equipResponse.data?.equipment || []);
        }
      } catch (error) {
        console.error("Failed to load dependency tools, codes, or equipments", error);
      }
    };
    loadResources();
  }, []);

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

        // Filter out empty checklist items
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

        await addMaintenanceGuide(formData);
        toast.success("Maintenance guide added successfully!");
        navigate("/admin/maintenance-guides");
      } catch (error: any) {
        console.error("Failed to save maintenance guide", error);
        toast.error(error?.response?.data?.message || "Failed to save maintenance guide");
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
    setChecklist([...checklist, { task: "", frequency: "", checked: false }]);
  };

  const removeChecklistItem = (index: number) => {
    const updated = checklist.filter((_, i) => i !== index);
    setChecklist(updated.length ? updated : [{ task: "", frequency: "", checked: false }]);
  };

  const handleChecklistChange = (index: number, field: keyof IChecklistItem, value: any) => {
    const updated = checklist.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setChecklist(updated);
  };

  const handleCheckboxChange = (field: "requiredTools" | "relatedCodes", id: string, checked: boolean) => {
    const currentValues = formik.values[field] as string[];
    if (checked) {
      formik.setFieldValue(field, [...currentValues, id]);
    } else {
      formik.setFieldValue(field, currentValues.filter(val => val !== id));
    }
  };

  return {
    navigate,
    fileInputRef,
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
    equipmentsList,
  };
}
