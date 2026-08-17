import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const getTrendingVideos = catchAsync(async (targetAudience?: string, search?: string, isAiVideo?: boolean) => {
  const params = new URLSearchParams();
  if (targetAudience) params.append("targetAudience", targetAudience);
  if (search) params.append("search", search);
  if (isAiVideo !== undefined) params.append("isAiVideo", String(isAiVideo));
  const queryStr = params.toString();
  const url = queryStr ? `/admin/trending-video?${queryStr}` : `/admin/trending-video`;
  const data = await httpsCall.get(url);
  return data;
});

export const addTrendingVideo = catchAsync(async (values: FormData) => {
  const data = await httpsCall.post(`/admin/trending-video`, values);
  return data;
});

export const updateTrendingVideo = catchAsync(async (id: string, values: FormData | any) => {
  const data = await httpsCall.patch(`/admin/trending-video/${id}`, values);
  return data;
});

export const deleteTrendingVideo = catchAsync(async (id: string) => {
  const data = await httpsCall.delete(`/admin/trending-video/${id}`);
  return data;
});

export const getTrendingVideo = catchAsync(async (id: string) => {
  const data = await httpsCall.get(`/admin/trending-video/${id}`);
  return data;
});
