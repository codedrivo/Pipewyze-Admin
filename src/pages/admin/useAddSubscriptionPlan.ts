import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { createSubscriptionPlan } from "../../service/apis/subscriptionPlan.api";

export interface AccessibleFeature {
  key: string;
  label: string;
  enabled: boolean;
}

export const SYSTEM_FEATURE_CATALOG: Omit<AccessibleFeature, "enabled">[] = [
  { key: "equipment", label: "Equipment & Parts Directory" },
  { key: "essential_tools", label: "Essential Tools & Recommendations" },
  { key: "maintenance_guides", label: "Maintenance Guides" },
  { key: "plumbing_codes", label: "Plumbing Code Reference" },
  { key: "training_videos", label: "Training Videos Library" },
  { key: "ai_assistant", label: "AI Assistant Access" },
];

export function useAddSubscriptionPlan() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [accessibleFeatures, setAccessibleFeatures] = useState<AccessibleFeature[]>([
    { key: "equipment", label: "Equipment & Parts Directory", enabled: false },
    { key: "essential_tools", label: "Essential Tools & Recommendations", enabled: false },
    { key: "maintenance_guides", label: "Maintenance Guides", enabled: false },
    { key: "plumbing_codes", label: "Plumbing Code Reference", enabled: false },
    { key: "training_videos", label: "Training Videos Library", enabled: false },
    { key: "ai_assistant", label: "AI Assistant Access", enabled: false },
  ]);
  const [selectedCatalogKey, setSelectedCatalogKey] = useState("");
  const [customKey, setCustomKey] = useState("");
  const [customLabel, setCustomLabel] = useState("");

  const availableCatalogFeatures = SYSTEM_FEATURE_CATALOG.filter(
    (cat) => !accessibleFeatures.some((existing) => existing.key === cat.key)
  );

  const addSelectedFeatureFromDropdown = (keyToAdd: string) => {
    if (!keyToAdd) return;
    const match = SYSTEM_FEATURE_CATALOG.find((cat) => cat.key === keyToAdd);
    if (match) {
      setAccessibleFeatures((prev) => [
        ...prev,
        { key: match.key, label: match.label, enabled: true },
      ]);
      setSelectedCatalogKey("");
      toast.success(`Added '${match.label}' to plan`);
    }
  };

  const toggleFeature = (index: number) => {
    setAccessibleFeatures((prev) =>
      prev.map((item, i) => (i === index ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const addCustomFeature = () => {
    if (!customLabel.trim()) {
      toast.error("Please enter a feature name/label");
      return;
    }
    const generatedKey = customKey.trim()
      ? customKey.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_")
      : customLabel.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");

    if (accessibleFeatures.some((f) => f.key === generatedKey)) {
      toast.error("A feature with this key is already added to this plan");
      return;
    }

    setAccessibleFeatures((prev) => [
      ...prev,
      { key: generatedKey, label: customLabel.trim(), enabled: true },
    ]);
    setCustomKey("");
    setCustomLabel("");
    toast.success(`Added custom feature '${customLabel}'`);
  };

  const removeFeature = (index: number) => {
    setAccessibleFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const validationSchema = yup.object({
    name: yup.string().required("Plan title is required"),
    tier: yup.string().required("Tier is required"),
    monthlyPrice: yup
      .number()
      .min(0, "Monthly price must be 0 or greater")
      .required("Monthly price is required"),
    yearlyPrice: yup
      .number()
      .min(0, "Yearly price must be 0 or greater")
      .required("Yearly price is required"),
    trialDays: yup
      .number()
      .min(0, "Trial days must be 0 or greater")
      .required("Trial days is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      tier: "standard",
      description: "",
      monthlyPrice: 0,
      yearlyPrice: 0,
      trialDays: 0,
      featuresText: "",
      stripeMonthlyPriceId: "",
      stripeYearlyPriceId: "",
      isActive: true,
      order: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSaving(true);
        const featuresArray = values.featuresText
          .split("\n")
          .map((f) => f.trim())
          .filter((f) => f.length > 0);

        const payload = {
          name: values.name,
          tier: values.tier,
          description: values.description,
          monthlyPrice: Number(values.monthlyPrice),
          yearlyPrice: Number(values.yearlyPrice),
          trialDays: Number(values.trialDays),
          features: featuresArray,
          accessibleFeatures,
          stripeMonthlyPriceId: values.stripeMonthlyPriceId,
          stripeYearlyPriceId: values.stripeYearlyPriceId,
          isActive: values.isActive,
          order: Number(values.order),
        };

        await createSubscriptionPlan(payload);
        toast.success("Subscription plan created successfully!");
        navigate("/admin/subscription-plans");
      } catch (error: any) {
        console.error("Failed to create subscription plan", error);
        toast.error(error?.message || "Failed to create subscription plan");
      } finally {
        setSaving(false);
      }
    },
  });

  return {
    navigate,
    formik,
    saving,
    accessibleFeatures,
    toggleFeature,
    addCustomFeature,
    removeFeature,
    customKey,
    setCustomKey,
    customLabel,
    setCustomLabel,
    availableCatalogFeatures,
    selectedCatalogKey,
    setSelectedCatalogKey,
    addSelectedFeatureFromDropdown,
  };
}
