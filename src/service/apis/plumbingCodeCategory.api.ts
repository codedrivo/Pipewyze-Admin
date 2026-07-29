import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const getPlumbingCodeCategories = catchAsync(async () => {
  const data = await httpsCall.get(`/admin/plumbing-code-category`);
  return data;
});

export const addPlumbingCodeCategory = catchAsync(async (values: { name: string; description?: string }) => {
  const data = await httpsCall.post(`/admin/plumbing-code-category`, values);
  return data;
});

export const updatePlumbingCodeCategory = catchAsync(async (id: string, values: { name: string; description?: string }) => {
  const data = await httpsCall.patch(`/admin/plumbing-code-category/${id}`, values);
  return data;
});

export const deletePlumbingCodeCategory = catchAsync(async (id: string) => {
  const data = await httpsCall.delete(`/admin/plumbing-code-category/${id}`);
  return data;
});
