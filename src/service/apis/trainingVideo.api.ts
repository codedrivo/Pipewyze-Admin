import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const getTrainingVideos = catchAsync(async (targetAudience?: string, search?: string, isAiVideo?: boolean) => {
  const params = new URLSearchParams();
  if (targetAudience) params.append("targetAudience", targetAudience);
  if (search) params.append("search", search);
  if (isAiVideo !== undefined) params.append("isAiVideo", String(isAiVideo));
  const queryStr = params.toString();
  const url = queryStr ? `/admin/training-video?${queryStr}` : `/admin/training-video`;
  const data = await httpsCall.get(url);
  return data;
});

export const addTrainingVideo = catchAsync(async (values: FormData) => {
  const data = await httpsCall.post(`/admin/training-video`, values);
  return data;
});

export const updateTrainingVideo = catchAsync(async (id: string, values: FormData | any) => {
  const data = await httpsCall.patch(`/admin/training-video/${id}`, values);
  return data;
});

export const deleteTrainingVideo = catchAsync(async (id: string) => {
  const data = await httpsCall.delete(`/admin/training-video/${id}`);
  return data;
});

export const getTrainingVideo = catchAsync(async (id: string) => {
  const data = await httpsCall.get(`/admin/training-video/${id}`);
  return data;
});
