import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { getFaqByIdApi, updateFaqApi } from "../../service/apis/faq.api";

export function useEditFaq() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const validationSchema = yup.object({
    question: yup.string().required("Question is required"),
    answer: yup.string().required("Answer is required"),
  });

  const formik = useFormik({
    initialValues: {
      question: "",
      answer: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!id) return;
      try {
        setSaving(true);
        await updateFaqApi(id, {
          question: values.question,
          answer: values.answer,
        });
        toast.success("FAQ updated successfully!");
        navigate("/admin/faqs");
      } catch (error: any) {
        console.error("Failed to update FAQ", error);
        toast.error("Failed to update FAQ");
      } finally {
        setSaving(false);
      }
    },
  });

  useEffect(() => {
    const fetchFaqDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await getFaqByIdApi(id);
        const data = res?.faq || res?.data?.faq || {};
        formik.setValues({
          question: data.question || "",
          answer: data.answer || "",
        });
      } catch (error) {
        console.error("Failed to load FAQ details", error);
        toast.error("Failed to load FAQ details");
        navigate("/admin/faqs");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqDetails();
  }, [id]);

  return {
    navigate,
    formik,
    loading,
    saving,
  };
}
