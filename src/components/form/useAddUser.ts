import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { addUser, updateUser } from "../../service/apis/user.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const normalizeUSPhoneNumber = (value: string) => {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }
  return digits;
};

export const formatUSPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  profileImage: File | string | null;
  role: string;
}
export const useAddUser = (id?: string) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const nameRegex = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;

  // Form validation schema
  const validationSchema = yup.object({
    firstName: yup
      .string()
      .required("First name is required")
      .matches(nameRegex, "First name should contain only letters"),
    lastName: yup
      .string()
      .required("Last name is required")
      .matches(nameRegex, "Last name should contain only letters"),
    email: yup.string().email().required("Email is required"),
    phoneNumber: yup
      .string()
      .required("Phone number is required")
      .test(
        "us-phone",
        "Enter a valid US phone number",
        (value) => normalizeUSPhoneNumber(value || "").length === 10
      ),
    role: yup.string().required("Role is required"),
    password: id
      ? yup.string().notRequired()
      : yup
          .string()
          .required("Password is required")
          .min(8, "Password must be at least 8 characters"),
  });

  // Formik setup
  const addUserFormik = useFormik<FormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      profileImage: null,
      role: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      const normalizedPhoneNumber = normalizeUSPhoneNumber(values.phoneNumber);
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("phone", normalizedPhoneNumber);
      formData.append("role", values.role);
      if (values.profileImage) {
        formData.append("profileimageurl", values.profileImage);
      }
      for (const pair of formData.entries()) {
        console.log(
          pair[0] + ": " + (pair[1] instanceof File ? pair[1].name : pair[1])
        );
      }
      try {
        if (id) {
          await updateUser(id, formData);
          navigate("/admin/users");
        } else {
          formData.append("email", values.email);
          if (!values.profileImage) {
            formData.append("profileimageurl", "/default_profile.png");
          }
          if (values.password && values.password.trim() !== "") {
            formData.append("password", values.password);
          }
          const response = await addUser(formData);
          toast.success(response.message);
          resetForm();
          navigate("/admin/users");
        }
      } catch {
        console.log("An error occurred while saving the user.");
      } finally {
        setLoading(false);
      }
    },
  });
  return {
    addUserFormik,
    loading,
  };
};
