import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const getPlumbingCodes = catchAsync(async () => {
  const data = await httpsCall.get(`/admin/plumbing-code`);
  return data;
});

export const addPlumbingCode = catchAsync(async (values: any) => {
  const data = await httpsCall.post(`/admin/plumbing-code`, values);
  return data;
});

export const updatePlumbingCode = catchAsync(async (id: string, values: any) => {
  const data = await httpsCall.patch(`/admin/plumbing-code/${id}`, values);
  return data;
});

export const deletePlumbingCode = catchAsync(async (id: string) => {
  const data = await httpsCall.delete(`/admin/plumbing-code/${id}`);
  return data;
});

export const getPlumbingCode = catchAsync(async (id: string) => {
  const data = await httpsCall.get(`/admin/plumbing-code/${id}`);
  return data;
});
