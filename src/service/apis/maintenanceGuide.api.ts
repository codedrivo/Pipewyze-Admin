import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const getMaintenanceGuides = catchAsync(async () => {
  const data = await httpsCall.get(`/admin/maintenance-guide`);
  return data;
});

export const addMaintenanceGuide = catchAsync(async (values: FormData) => {
  const data = await httpsCall.post(`/admin/maintenance-guide`, values);
  return data;
});

export const updateMaintenanceGuide = catchAsync(async (id: string, values: FormData) => {
  const data = await httpsCall.patch(`/admin/maintenance-guide/${id}`, values);
  return data;
});

export const deleteMaintenanceGuide = catchAsync(async (id: string) => {
  const data = await httpsCall.delete(`/admin/maintenance-guide/${id}`);
  return data;
});

export const getMaintenanceGuide = catchAsync(async (id: string) => {
  const data = await httpsCall.get(`/admin/maintenance-guide/${id}`);
  return data;
});
