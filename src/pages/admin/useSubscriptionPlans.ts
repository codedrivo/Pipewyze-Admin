import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} from "../../service/apis/subscriptionPlan.api";

export interface SubscriptionPlanItem {
  id?: string;
  _id?: string;
  name: string;
  tier: "freemium" | "standard" | "professional";
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  trialDays: number;
  features: string[];
  stripeMonthlyPriceId: string;
  stripeYearlyPriceId: string;
  isActive: boolean;
  order: number;
}

export function useSubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlanItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states for plan editing
  const [openModal, setOpenModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlanItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    tier: "standard" as "freemium" | "standard" | "professional",
    description: "",
    monthlyPrice: 0,
    yearlyPrice: 0,
    trialDays: 7,
    featuresText: "",
    stripeMonthlyPriceId: "",
    stripeYearlyPriceId: "",
    isActive: true,
    order: 0,
  });

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await getSubscriptionPlans();
      if (res && res.plans) {
        setPlans(res.plans);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to fetch subscription plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleOpenEditModal = (plan: SubscriptionPlanItem) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      tier: plan.tier,
      description: plan.description || "",
      monthlyPrice: plan.monthlyPrice || 0,
      yearlyPrice: plan.yearlyPrice || 0,
      trialDays: plan.trialDays || 0,
      featuresText: (plan.features || []).join("\n"),
      stripeMonthlyPriceId: plan.stripeMonthlyPriceId || "",
      stripeYearlyPriceId: plan.stripeYearlyPriceId || "",
      isActive: plan.isActive !== undefined ? plan.isActive : true,
      order: plan.order || 0,
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingPlan(null);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Plan name is required");
      return;
    }

    setLoading(true);
    try {
      const featuresArray = formData.featuresText
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const payload = {
        name: formData.name,
        tier: formData.tier,
        description: formData.description,
        monthlyPrice: Number(formData.monthlyPrice),
        yearlyPrice: Number(formData.yearlyPrice),
        trialDays: Number(formData.trialDays),
        features: featuresArray,
        stripeMonthlyPriceId: formData.stripeMonthlyPriceId,
        stripeYearlyPriceId: formData.stripeYearlyPriceId,
        isActive: formData.isActive,
        order: Number(formData.order),
      };

      if (editingPlan) {
        const id = editingPlan._id || editingPlan.id;
        await updateSubscriptionPlan(id!, payload);
        toast.success("Subscription plan updated successfully");
      } else {
        await createSubscriptionPlan(payload);
        toast.success("Subscription plan created successfully");
      }
      handleCloseModal();
      fetchPlans();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save subscription plan");
    } finally {
      setLoading(false);
    }
  };

  // Delete confirmation dialog state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedDeletePlanId, setSelectedDeletePlanId] = useState<string | null>(null);

  const handleOpenDeleteDialog = (id: string) => {
    setSelectedDeletePlanId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedDeletePlanId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDeletePlanId) return;
    setLoading(true);
    try {
      await deleteSubscriptionPlan(selectedDeletePlanId);
      toast.success("Subscription plan deleted successfully");
      handleCloseDeleteDialog();
      fetchPlans();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete subscription plan");
    } finally {
      setLoading(false);
    }
  };

  return {
    plans,
    loading,
    openModal,
    editingPlan,
    formData,
    setFormData,
    handleOpenEditModal,
    handleCloseModal,
    handleSavePlan,
    openDeleteDialog,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleDeleteConfirm,
    refetchPlans: fetchPlans,
  };
}
