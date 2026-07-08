import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { resetPasswordApi } from "../../service/apis/auth.api";
import { VALIDATION_MESSAGES } from "../../utils/message/messages";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Define the shape of the form values
interface ResetPasswordFormValues {
  otp: string;
  password: string;
  confirmpassword: string;
}

export const useReset = (email: string | null) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const resetPasswordFormik = useFormik<ResetPasswordFormValues>({
    initialValues: {
      otp: "",
      password: "",
      confirmpassword: "",
    },
    validationSchema: yup.object({
      otp: yup.string().trim().required(VALIDATION_MESSAGES.otpRequired),

      password: yup
        .string()
        .required(VALIDATION_MESSAGES.passwordRequired)
        .min(8, VALIDATION_MESSAGES.passwordMinLength)
        .matches(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          VALIDATION_MESSAGES.passwordComplexity
        ),

      confirmpassword: yup
        .string()
        .required(VALIDATION_MESSAGES.confirmPasswordRequired)
        .oneOf([yup.ref("password")], VALIDATION_MESSAGES.passwordsMustMatch),
    }),
    onSubmit: async (values) => {
      const bodyData = {
        email: email,
        otp: values.otp,
        password: values.password,
      };

      try {
        setLoading(true);
        const response = await resetPasswordApi(bodyData);
        toast.success(
          response?.message || "Password has been changed successfully"
        );
        navigate("/login");
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || "Invalid or expired OTP";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  return {
    resetPasswordFormik,
    loading,
  };
};
