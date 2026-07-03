import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  createServiceApi,
  getPlansForDropdownApi,
} from "../../service/apis/service.api";

interface FormValues {
  name: string;
  price: string;
  yearlyPrice: string;
  estimatedTime: string;
  features: string;
  overview: string;
  whatWeWillDo: string;
  whatWeNeedFromYou: string;
  imageUrl: File | null;
}

const DEFAULT_SERVICE_IMAGE = "/no_image.png";

export const useAddService = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await getPlansForDropdownApi();
        if (res?.status === 200) {
          setPlans(res?.plans || res?.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch plans", error);
      }
    };
    fetchPlans();
  }, []);

  const validationSchema = yup.object({
    name: yup.string().required("Service name is required"),
    // price: yup
    //   .number()
    //   .typeError("Must be a number")
    //   .positive("Price must be positive")
    //   .required("Price is required"),
    price: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value
      )
      .typeError("Must be a number")
      .positive("Price must be positive")
      .required("Price is required"),
    yearlyPrice: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value
      )
      .typeError("Must be a number")
      .positive("Price must be positive")
      .required("Price is required"),
    estimatedTime: yup.string().optional(),
    overview: yup.string().optional(),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      price: "",
      yearlyPrice: "",
      estimatedTime: "",
      features: "",
      overview: "",
      whatWeWillDo: "",
      whatWeNeedFromYou: "",
      imageUrl: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("estimatedTime", values.estimatedTime);
      // formData.append("price", values.price);
      formData.append("price", String(values.price || ""));
      formData.append("yearlyPrice", String(values.yearlyPrice || ""));
      if (values.overview) formData.append("overview", values.overview);
      if (values.whatWeWillDo)
        formData.append("whatWeWillDo", values.whatWeWillDo);
      if (values.whatWeNeedFromYou)
        formData.append("whatWeNeedFromYou", values.whatWeNeedFromYou);

      if (values.features) {
        const featuresArray = values.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean);
        featuresArray.forEach((feature) =>
          formData.append("features", feature)
        );
      }

      // formData.append("imageUrl", values.imageUrl || DEFAULT_SERVICE_IMAGE);
      if (values.imageUrl instanceof File) {
        formData.append("imageUrl", values.imageUrl);
      } else {
        formData.append("imageUrl", DEFAULT_SERVICE_IMAGE);
      }

      try {
        const response = await createServiceApi(formData);
        if (response?.status === 201 || response?.status === 200) {
          toast.success("Service created successfully");
          resetForm();
          navigate("/admin/services");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    },
  });

  return { formik, loading, plans };
};
