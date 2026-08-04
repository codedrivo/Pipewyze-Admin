import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const getEquipmentCategories = catchAsync(async () => {
  const data = await httpsCall.get(`/admin/equipment-category`);
  return data;
});

export const addEquipmentCategory = catchAsync(async (values: { name: string; description?: string }) => {
  const data = await httpsCall.post(`/admin/equipment-category`, values);
  return data;
});

export const updateEquipmentCategory = catchAsync(async (id: string, values: { name: string; description?: string }) => {
  const data = await httpsCall.patch(`/admin/equipment-category/${id}`, values);
  return data;
});

export const deleteEquipmentCategory = catchAsync(async (id: string) => {
  const data = await httpsCall.delete(`/admin/equipment-category/${id}`);
  return data;
});
