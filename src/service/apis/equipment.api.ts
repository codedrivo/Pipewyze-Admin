import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const getPlumberEquipment = catchAsync(async (plumberId: string) => {
  const data = await httpsCall.get(`/admin/equipment/plumber/${plumberId}`);
  return data;
});

export const addEquipment = catchAsync(async (values: FormData) => {
  const data = await httpsCall.post(`/admin/equipment/add`, values);
  return data;
});

export const updateEquipment = catchAsync(async (id: string, values: FormData) => {
  const data = await httpsCall.patch(`/admin/equipment/update/${id}`, values);
  return data;
});

export const deleteEquipment = catchAsync(async (id: string) => {
  const data = await httpsCall.delete(`/admin/equipment/delete/${id}`);
  return data;
});
