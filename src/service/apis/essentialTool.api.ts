import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const getEssentialTools = catchAsync(async () => {
  const data = await httpsCall.get(`/admin/essential-tool`);
  return data;
});

export const addEssentialTool = catchAsync(async (values: FormData) => {
  const data = await httpsCall.post(`/admin/essential-tool`, values);
  return data;
});

export const updateEssentialTool = catchAsync(async (id: string, values: FormData) => {
  const data = await httpsCall.patch(`/admin/essential-tool/${id}`, values);
  return data;
});

export const deleteEssentialTool = catchAsync(async (id: string) => {
  const data = await httpsCall.delete(`/admin/essential-tool/${id}`);
  return data;
});
