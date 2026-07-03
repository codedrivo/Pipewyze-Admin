// import { useFormik } from "formik";
// import * as yup from "yup";
// import { forgotPasswordApi } from "../../service/apis/auth.api";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// export const useForgotPass = () => {
//   const navigate = useNavigate();
//   const forgotPassFormik = useFormik({
//     initialValues: {
//       email: "",
//     },
//     validationSchema: yup.object({
//       email: yup
//         .string()
//         .email("Please enter a valid email address")
//         .required("Email address is required"),
//     }),
//     onSubmit: async (values) => {
//       const response = await forgotPasswordApi(values);
//       if (response.status === 200) {
//         localStorage.setItem("email", values.email);
//         toast.success("OTP sent to your email ID");
//         navigate("/reset-password");
//       }
//     },
//   });
//   return {
//     forgotPassFormik,
//   };
// };

import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { forgotPasswordApi } from "../../service/apis/auth.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { emailSchema } from "../../utils/validation/validationSchemas";

export const useForgotPass = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const forgotPassFormik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: yup.object({
      email: emailSchema,
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await forgotPasswordApi(values);
        localStorage.setItem("email", values.email);
        toast.success(response?.message || "OTP sent to your email address");
        navigate("/reset-password");
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || "Email not present in our records.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  return {
    forgotPassFormik,
    loading,
  };
};
