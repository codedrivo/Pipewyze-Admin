import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const getSubscriptionPlans = catchAsync(async () => {
  const data = await httpsCall.get(`/admin/subscription-plans`);
  return data;
});

export const createSubscriptionPlan = catchAsync(async (values: any) => {
  const data = await httpsCall.post(`/admin/subscription-plans`, values);
  return data;
});

export const updateSubscriptionPlan = catchAsync(async (id: string, values: any) => {
  const data = await httpsCall.put(`/admin/subscription-plans/${id}`, values);
  return data;
});

export const deleteSubscriptionPlan = catchAsync(async (id: string) => {
  const data = await httpsCall.delete(`/admin/subscription-plans/${id}`);
  return data;
});
