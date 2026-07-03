import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { addCareer, updateCareer } from "../../service/apis/carrer.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface FormValues {
  careername: string;
  careerlogo: string | null;
}

export const useCareerUser = (id?: string) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form validation schema
  const validationSchema = yup.object({
    careername: yup.string().required("Career name is required"),
    careerlogo: yup.mixed()
    .test(
      "logo-required",
      "Career logo is required",
      (value: any) => {
        if (!id) {
          return value instanceof File;
        }
        return true;
      }
    )
    .test(
      "fileSize",
      "Logo size must be at least 5MB",
      (value: any) => {
        if (!value || typeof value === "string") return true;
        return value.size >= 5 * 1024 * 1024;
      }
    )
    .test(
      "fileType",
      "Only JPG, JPEG or PNG allowed",
      (value: any) => {
        if (!value || typeof value === "string") return true;
        return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
      }
    ),
  });

  // Formik setup
  const addCareerFormik = useFormik<FormValues>({
    initialValues: {
      careername: "",
      careerlogo: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      const formData = new FormData();
      formData.append("careerName", values.careername);
      if (values.careerlogo) {
        formData.append("careerLogo", values.careerlogo);
      }
      try {
        if (id) {
          const response = await updateCareer(id, formData);
          if (response.status === 200) {
            toast.success(response.message);
            navigate("/admin/career");
          }
        } else {
          const response = await addCareer(formData);
          if (response.status === 200) {
            toast.success(response.message);
            resetForm();
            navigate("/admin/career");
          }
        }
      } catch (error) {
        console.log("An error occurred while saving the career.");
      } finally {
        setLoading(false);
      }
    },
  });
  return {
    addCareerFormik,
    loading,
  };
};
