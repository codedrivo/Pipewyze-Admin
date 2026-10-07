import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { addFaqApi } from "../../service/apis/faq.api";

export function useAddFaq() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
      try {
        setLoading(true);
        await addFaqApi({
          question: values.question,
          answer: values.answer,
        });
        toast.success("FAQ created successfully!");
        navigate("/admin/faqs");
      } catch (error: any) {
        console.error("Failed to add FAQ", error);
        toast.error("Failed to add FAQ");
      } finally {
        setLoading(false);
      }
    },
  });

  return {
    navigate,
    formik,
    loading,
  };
}
