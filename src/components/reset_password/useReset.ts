import { useFormik } from "formik";
import * as yup from "yup";
import { resetPasswordApi } from "../../service/apis/auth.api";
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
  const resetPasswordFormik = useFormik<ResetPasswordFormValues>({
    initialValues: {
      otp: "",
      password: "",
      confirmpassword: "",
    },
    validationSchema: yup.object({
      otp: yup.string().trim().required("OTP field is Required"),

      password: yup
        .string()
        .trim()
        .min(8, "Must be 8 or more than 8 characters")
        .required("Password field is Required")
        .matches(/\w/, "Please enter valid password"),

      confirmpassword: yup
        .string()
        .trim()
        .min(8, "Must be 8 or more than 8 characters")
        .required("Confirm Password field is Required")
        .oneOf([yup.ref("password")], "Passwords must match") // Ensure passwords match
        .matches(/\w/, "Please enter valid password"),
    }),
    onSubmit: async (values) => {
      const bodyData = {
        email: email,
        otp: values.otp,
        password: values.password,
      };

      try {
        const response = await resetPasswordApi(bodyData);
        toast.success(
          response?.message || "Password has been changed successfully"
        );
        navigate("/login");
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || "Invalid or expired OTP";
        toast.error(errorMessage);
      }
    },
  });

  return {
    resetPasswordFormik,
  };
};
