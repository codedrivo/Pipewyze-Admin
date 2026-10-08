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
    exception: yup.string().optional().nullable(),
    plainLanguageInterpretation: yup.string().required("Plain Language Interpretation is required"),
    documentName: yup.string().transform((val) => (val === null ? "" : val)).optional().nullable(),
    documentUrl: yup
      .string()
      .transform((val) => (val === null ? "" : val))
      .optional()
      .nullable()
      .test("valid-url", "Must be a valid URL starting with http:// or https://", (value) => {
        if (!value || typeof value !== "string" || value.trim() === "") return true;
        try {
          const parsed = new URL(value.trim());
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      }),
  });

  const formik = useFormik({
    initialValues: {
      code: "",
      title: "",
      category: "",
      description: "",
      exception: "",
      plainLanguageInterpretation: "",
      documentName: "",
      documentUrl: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        const payload: any = {
          code: values.code,
          title: values.title,
          category: values.category,
          description: values.description,
          exception: values.exception || "",
          plainLanguageInterpretation: values.plainLanguageInterpretation,
          documentName: values.documentName || "",
          documentUrl: values.documentUrl || "",
        };
        if (values.documentName || values.documentUrl) {
          payload.documents = [
            {
              name: values.documentName || "Reference Document / PDF",
              url: values.documentUrl || "",
            },
          ];
        } else {
          payload.documents = [];
        }
        await addPlumbingCode(payload);
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

