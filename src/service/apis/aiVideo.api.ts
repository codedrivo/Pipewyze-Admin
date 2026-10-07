import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

// Questions API
export const getQuestions = catchAsync(async (search?: string) => {
  const url = search ? `/admin/ai-videos/questions?search=${search}` : `/admin/ai-videos/questions`;
  const data = await httpsCall.get(url);
  return data;
});

export const addQuestion = catchAsync(async (values: any) => {
  const data = await httpsCall.post(`/admin/ai-videos/questions`, values);
  return data;
});

export const updateQuestion = catchAsync(async (id: string, values: any) => {
  const data = await httpsCall.patch(`/admin/ai-videos/questions/${id}`, values);
  return data;
});

export const deleteQuestion = catchAsync(async (id: string) => {
  const data = await httpsCall.delete(`/admin/ai-videos/questions/${id}`);
  return data;
});

// Videos API
export const getAiVideos = catchAsync(async (questionId?: string, targetAudience?: string, search?: string) => {
  const params = new URLSearchParams();
  if (questionId) params.append("questionId", questionId);
  if (targetAudience) params.append("targetAudience", targetAudience);
  if (search) params.append("search", search);
  const queryStr = params.toString();
  const url = queryStr ? `/admin/ai-videos?${queryStr}` : `/admin/ai-videos`;
  const data = await httpsCall.get(url);
  return data;
});

export const addAiVideo = catchAsync(async (values: FormData) => {
  const data = await httpsCall.post(`/admin/ai-videos`, values);
  return data;
});

export const updateAiVideo = catchAsync(async (id: string, values: FormData | any) => {
  const data = await httpsCall.patch(`/admin/ai-videos/${id}`, values);
  return data;
});

export const deleteAiVideo = catchAsync(async (id: string) => {
  const data = await httpsCall.delete(`/admin/ai-videos/${id}`);
  return data;
});

export const getAiVideoById = catchAsync(async (id: string) => {
  const data = await httpsCall.get(`/admin/ai-videos/${id}`);
  return data;
});
