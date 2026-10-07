import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const getAiPrompts = catchAsync(async (role?: string) => {
  const url = role ? `/admin/ai-prompts?role=${role}` : `/admin/ai-prompts`;
  const data = await httpsCall.get(url);
  return data;
});

export const addAiPrompt = catchAsync(async (values: any) => {
  const data = await httpsCall.post(`/admin/ai-prompts`, values);
  return data;
});

export const updateAiPrompt = catchAsync(async (id: string, values: any) => {
  const data = await httpsCall.put(`/admin/ai-prompts/${id}`, values);
  return data;
});

export const deleteAiPrompt = catchAsync(async (id: string) => {
  const data = await httpsCall.delete(`/admin/ai-prompts/${id}`);
  return data;
});

export const getUserAiUsageReport = catchAsync(async (page = 1, limit = 10, search = "") => {
  const url = `/admin/ai-prompts/user-usage?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
  const data = await httpsCall.get(url);
  return data;
});
