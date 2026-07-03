import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";

import toast from "react-hot-toast";
import { forgotPassword, verifyOtp } from "../../../service/auth.service";
import { otpValidationSchema } from "../../../utils/validation/validationSchemas";

const useVerifyPhone = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const phone = location.state?.phone || sessionStorage.getItem("reset_phone");

  useEffect(() => {
    if (!phone) {
      navigate("/auth/forgot-password");
    }
  }, [phone, navigate]);

  // Timer using setInterval
  useEffect(() => {
    let intervalId: number | undefined;
    if (timer > 0) {
      intervalId = window.setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [timer]);

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: otpValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await verifyOtp({
          phone: phone,
          otp: values.otp,
        });
        toast.success(response?.message || "OTP Verified Successfully!");
        navigate("/auth/reset-password", { state: { phone, otp: values.otp } });
      } catch (error: any) {
        // If OTP is invalid, show the proper error message
        const errorMessage =
          error?.response?.data?.message ||
          "Invalid OTP. Please enter a valid OTP.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  // ... handleResend, handleBack, handleBackToLogin remain the same ...
  // Just ensure they use try/catch with showErrorToast(error?.response?.data?.message)

  return {
    loading,
    timer,
    canResend,
    phone,
    formik,
    // ...
  };
};

export default useVerifyPhone;
