import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const getTrendingVideos = catchAsync(async (search?: string) => {
  const url = search ? `/admin/trending-video?search=${search}` : `/admin/trending-video`;
  const data = await httpsCall.get(url);
  return data;
});

export const addTrendingVideo = catchAsync(async (values: FormData) => {
  const data = await httpsCall.post(`/admin/trending-video`, values);
  return data;
});

export const updateTrendingVideo = catchAsync(async (id: string, values: FormData) => {
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
