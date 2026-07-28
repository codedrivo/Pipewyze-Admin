import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const getMyEquipment = catchAsync(async () => {
  const data = await httpsCall.get(`/public/home-owner/equipment`);
  return data;
});

export const addMyEquipment = catchAsync(async (values: FormData) => {
  const data = await httpsCall.post(`/public/home-owner/equipment`, values);
  return data;
});

export const updateMyEquipment = catchAsync(async (id: string, values: FormData) => {
  const data = await httpsCall.patch(`/public/home-owner/equipment/${id}`, values);
  return data;
});

export const deleteMyEquipment = catchAsync(async (id: string) => {
  const data = await httpsCall.delete(`/public/home-owner/equipment/${id}`);
  return data;
});
