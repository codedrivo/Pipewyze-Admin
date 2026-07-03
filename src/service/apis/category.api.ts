import httpsCall from "../httpsCall";

export const getCategoriesApi = async (page = 1, limit = 1000, search = "") => {
  const response = await httpsCall.get(
    `admin/category?page=${page}&limit=${limit}&search=${search}`
  );
  return response.data;
};

export const getCategoryByIdApi = async (id: string) => {
  const response = await httpsCall.get(`admin/category/${id}`);
  return response.data;
};

export const addCategoryApi = async (payload: {
  label: string;
  [key: string]: any;
}) => {
  const response = await httpsCall.post("admin/category/add-category", payload);
  return response.data;
};
export const updateCategoryApi = async (
  id: string,
  payload: { label: string }
) => {
  const response = await httpsCall.patch(
    `admin/category/update-category/${id}`,
    payload
  );
  return response.data;
};

export const deleteCategoryApi = async (id: string) => {
  const response = await httpsCall.delete(
    `admin/category/remove-category/${id}`
  );
  return response.data;
};
