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
  firstName: string;
  lastName: string;
  // DOB: Date | null;
  // maritalStatus: string;
  phoneNumber: string;
  email: string;
  profileImage: File | string | null;
}
export const useProfileUpdate = () => {
  const dispatch = useDispatch();

  const nameRegex = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;

  const validationSchema = yup.object({
    firstName: yup
      .string()
      .required("First name is required")
      .matches(nameRegex, "First name should contain only letters"),
    lastName: yup
      .string()
      .required("Last name is required")
      .matches(nameRegex, "Last name should contain only letters"),
    // DOB: yup.date().required("Birthday is required"),
    // maritalStatus: yup.string().required("Marital Status is required"),
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
      firstName: "",
      lastName: "",
      // DOB: null,
      // maritalStatus: "",
      phoneNumber: "",
      email: "",
      profileImage: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const bodyData = {
        firstName: values.firstName,
        lastName: values.lastName,
        // DOB: values.DOB,
        // maritalStatus: values.maritalStatus,
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
