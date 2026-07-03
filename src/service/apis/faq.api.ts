import httpsCall from "../httpsCall";

export const getFaqsApi = async (page: number, limit: number, search = "") => {
  const response = await httpsCall.post(
    `admin/faq/faq-list/${page}/${limit}?search=${search}`
  );
  return response.data;
};

export const getFaqByIdApi = async (id: string) => {
  const response = await httpsCall.get(`admin/faq/faq-detail/${id}`);
  return response.data;
};

export const addFaqApi = async (data: {
  question: string;
  answer: string;
  category: string;
}) => {
  const response = await httpsCall.post("admin/faq/add-faq", data);
  return response.data;
};

export const updateFaqApi = async (
  id: string,
  data: { question: string; answer: string; category: string }
) => {
  const response = await httpsCall.patch(`admin/faq/update-faq/${id}`, data);
  return response.data;
};

export const deleteFaqApi = async (id: string) => {
  const response = await httpsCall.delete(`admin/faq/remove-faq/${id}`);
  return response.data;
};
