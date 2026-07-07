import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { updateProfile, updateProfileImage } from "../../../service/apis/user.api";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/auth.store";

const normalizeUSPhoneNumber = (value: string) => {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }
  return digits;
};

interface FormValues {
  fullName: string;
  phoneNumber: string;
  email: string;
  profileImage: File | string | null;
}
export const useProfileUpdate = () => {
  const dispatch = useDispatch();

  const nameRegex = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;

  const validationSchema = yup.object({
    fullName: yup
      .string()
      .required("Full name is required"),
    phoneNumber: yup
      .string()
      .required("Phone number is required")
      .test(
        "us-phone",
        "Enter a valid US phone number",
        (value) => normalizeUSPhoneNumber(value || "").length === 10
      ),
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email address is required"),
  });

  // Formik setup
  const addProfileFormik = useFormik<FormValues>({
    initialValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      profileImage: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const bodyData = {
        fullName: values.fullName,
        phone: normalizeUSPhoneNumber(values.phoneNumber),
        email: values.email,
      };

      try {
        const response = await updateProfile(bodyData);
        toast.success("Profile updated successfully");
        dispatch(setUser(response.userData));

        if (values.profileImage instanceof File) {
          const imageFormData = new FormData();
          imageFormData.append("profileimageurl", values.profileImage);
          const imageResponse = await updateProfileImage(imageFormData);
          dispatch(setUser(imageResponse.userData));
        }
      } catch {
        console.log("An error occurred while updating the profile.");
      }
    },
  });
  return {
    addProfileFormik,
  };
};
