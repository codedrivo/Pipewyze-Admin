import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { decodeHTMLEntities } from "../../utils/htmlDecoder";
import {
  getPlansForDropdownApi,
  getServiceDetailsApi,
  updateServiceApi,
} from "../../service/apis/service.api";

interface FormValues {
  name: string;
  price: string;
  yearlyPrice: string;
  planId: string;
  estimatedTime: string;
  features: string;
  overview: string;
  whatWeWillDo: string;
  whatWeNeedFromYou: string;
  image: File | string | null;
}

const DEFAULT_SERVICE_IMAGE = "/no_image.png";

export const useUpdateService = (id?: string) => {
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
    price: yup.number().required("Price is required").positive(),
    yearlyPrice: yup.number().required("Yearly price is required").positive(),
    planId: yup.string().notRequired(), // Must not be required because UI field is commented out
    estimatedTime: yup.string().notRequired(),
    overview: yup.string().notRequired(),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      price: "",
      yearlyPrice: "",
      planId: "",
      estimatedTime: "",
      features: "",
      overview: "",
      whatWeWillDo: "",
      whatWeNeedFromYou: "",
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!id) {
        toast.error("Service id is missing");
        return;
      }

      setLoading(true);
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("price", values.price.toString());
      formData.append("yearlyPrice", values.yearlyPrice.toString());
      formData.append("estimatedTime", values.estimatedTime);

      if (values.overview) formData.append("overview", values.overview);
      if (values.whatWeWillDo)
        formData.append("whatWeWillDo", values.whatWeWillDo);
      if (values.whatWeNeedFromYou)
        formData.append("whatWeNeedFromYou", values.whatWeNeedFromYou);

      if (values.features) {
        const featuresArray = values.features.split(",").map((f) => f.trim());
        featuresArray.forEach((feature) => {
          if (feature) formData.append("features", feature);
        });
      }

      if (values.image instanceof File) {
        formData.append("imageUrl", values.image);
      } else {
        formData.append(
          "imageUrl",
          typeof values.image === "string"
            ? values.image
            : DEFAULT_SERVICE_IMAGE
        );
      }

      try {
        const response = await updateServiceApi(id, formData);
        if (response?.status === 200) {
          toast.success("Service updated successfully");
          navigate("/admin/services");
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error?.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (!id) return;

    const fetchServiceDetails = async () => {
      setLoading(true);
      try {
        const res = await getServiceDetailsApi(id);
        const serviceData = res?.service || res?.serviceData || res?.data || {};

        // Extract price from the nested plans array if it's not at the root
        let oneTimePrice = "";
        let yearlyPrice = "";

        if (serviceData?.plans?.length) {
          const oneTimePlan = serviceData.plans.find(
            (p: any) => p.interval === "one-time"
          );

          const yearlyPlan = serviceData.plans.find(
            (p: any) => p.interval === "year"
          );

          if (oneTimePlan) oneTimePrice = String(oneTimePlan.price);
          if (yearlyPlan) yearlyPrice = String(yearlyPlan.price);
        }

        const getFeatureLabel = (feature: any) => {
          if (typeof feature === "string") return feature;
          if (feature?.name) return feature.name;
          if (feature?.title) return feature.title;
          return "";
        };

        formik.setValues({
          name: serviceData?.name || "",
          price: oneTimePrice,
          yearlyPrice: yearlyPrice,
          planId:
            serviceData?.planId?._id ||
            serviceData?.planId?.id ||
            serviceData?.planId ||
            "",
          estimatedTime: serviceData?.estimatedTime || "",
          features: Array.isArray(serviceData?.features)
            ? serviceData.features
                .map(getFeatureLabel)
                .filter(Boolean)
                .join(", ")
            : serviceData?.features || "",
          overview: decodeHTMLEntities(serviceData?.overview || ""),
          whatWeWillDo: decodeHTMLEntities(serviceData?.whatWeWillDo || ""),
          whatWeNeedFromYou: decodeHTMLEntities(serviceData?.whatWeNeedFromYou || ""),
          image:
            serviceData?.image ||
            serviceData?.imageUrl ||
            serviceData?.serviceImage ||
            null,
        });
      } catch (error) {
        console.error("Failed to fetch service details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id]);

  // THIS FILE MUST NEVER CONTAIN HTML OR JSX. IT ENDS HERE.
  return { formik, loading, plans };
};
