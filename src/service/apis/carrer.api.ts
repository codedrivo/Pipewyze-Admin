import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const careerApi = catchAsync(async (values: any) => {
  const data = await httpsCall.post(
    `/admin/career/list/${values.currentPage}/${values.limit}`,
    values
  );
  return data;
});

export const CareerDetails = catchAsync(async (uid: string) => {
  const data = await httpsCall.get(`/admin/career/view-career/${uid}`);
  return data;
});

export const addCareer = catchAsync(async (values: FormData) => {
  const data = await httpsCall.post(`/admin/career/add-career`, values);
  return data;
});

export const updateCareer = catchAsync(async (uid: string, values: FormData) => {
  const data = await httpsCall.patch(`/admin/career/update-career/${uid}`, values);
  return data;
});

export const deleteCareer = catchAsync(async (uid: string | null) => {
  const data = await httpsCall.delete(`/admin/career/delete-career/${uid}`);
  return data;
});
