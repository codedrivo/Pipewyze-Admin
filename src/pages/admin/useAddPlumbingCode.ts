import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { addPlumbingCode } from "../../service/apis/plumbingCode.api";
import { getPlumbingCodeCategories } from "../../service/apis/plumbingCodeCategory.api";
import { IPlumbingCodeCategory } from "./usePlumbingCodeCategories";

export function useAddPlumbingCode() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<IPlumbingCodeCategory[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await getPlumbingCodeCategories();
      if (response?.status === 200) {
        const list = response.categories || response.data?.categories || [];
        setCategories(list);
        if (list.length > 0) {
          formik.setFieldValue("category", list[0].name);
        }
      }
    } catch (error) {
      console.error("Failed to load plumbing code categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const validationSchema = yup.object({
    code: yup.string().required("Code Identifier (e.g. 248 CMR 10.05) is required"),
    title: yup.string().required("Title is required"),
    category: yup.string().required("Category is required"),
    description: yup.string().required("Description is required"),
    exception: yup.string().optional(),
    plainLanguageInterpretation: yup.string().required("Plain Language Interpretation is required"),
  });

  const formik = useFormik({
    initialValues: {
      code: "",
      title: "",
      category: "",
      description: "",
      exception: "",
      plainLanguageInterpretation: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        await addPlumbingCode(values);
        toast.success("Plumbing code added successfully!");
        navigate("/admin/plumbing-codes");
      } catch (error: any) {
        console.error("Failed to add plumbing code", error);
        toast.error(error?.response?.data?.message || "Failed to add plumbing code");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return {
    navigate,
    submitting,
    formik,
    categories,
  };
}

