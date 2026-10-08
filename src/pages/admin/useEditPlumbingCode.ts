import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { getPlumbingCode, updatePlumbingCode } from "../../service/apis/plumbingCode.api";
import { IPlumbingCode } from "./usePlumbingCodes";
import { getPlumbingCodeCategories } from "../../service/apis/plumbingCodeCategory.api";
import { IPlumbingCodeCategory } from "./usePlumbingCodeCategories";
import { decodeHTMLEntities } from "../../utils/htmlDecoder";

export function useEditPlumbingCode() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [codeDetails, setCodeDetails] = useState<IPlumbingCode | null>(null);
  const [categories, setCategories] = useState<IPlumbingCodeCategory[]>([]);

  const fetchCategoriesAndDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      
      // Load categories first
      const catResponse = await getPlumbingCodeCategories();
      let catsList: IPlumbingCodeCategory[] = [];
      if (catResponse?.status === 200) {
        catsList = catResponse.categories || catResponse.data?.categories || [];
        setCategories(catsList);
      }

      // Load code details
      const response = await getPlumbingCode(id);
      if (response?.status === 200) {
        const code = response.code || response.data?.code;
        setCodeDetails(code);
        const docName = code.documentName || (code.documents && code.documents[0] ? code.documents[0].name : "");
        const docUrl = code.documentUrl || (code.documents && code.documents[0] ? code.documents[0].url : "");
        formik.resetForm({
          values: {
            code: code.code || "",
            title: code.title || "",
            category: code.category || (catsList.length > 0 ? catsList[0].name : ""),
            description: decodeHTMLEntities(code.description || ""),
            exception: decodeHTMLEntities(code.exception || ""),
            plainLanguageInterpretation: decodeHTMLEntities(code.plainLanguageInterpretation || ""),
            documentName: docName,
            documentUrl: docUrl,
          },
        });
      }
    } catch (error) {
      console.error("Failed to load plumbing code details", error);
      toast.error("Failed to load plumbing code details");
      navigate("/admin/plumbing-codes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesAndDetails();
  }, [id]);

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
      if (!id) return;
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
        await updatePlumbingCode(id, payload);
        toast.success("Plumbing code updated successfully!");
        navigate("/admin/plumbing-codes");
      } catch (error: any) {
        console.error("Failed to update plumbing code", error);
        toast.error(error?.response?.data?.message || "Failed to update plumbing code");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return {
    navigate,
    loading,
    submitting,
    formik,
    categories,
  };
}
