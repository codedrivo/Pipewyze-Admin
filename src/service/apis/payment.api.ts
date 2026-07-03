import httpsCall from "../httpsCall";

export const getOrdersApi = async (
  page: number,
  limit: number,
  search = ""
) => {
  const response = await httpsCall.get(
    `/admin/orders?page=${page}&limit=${limit}&search=${search}`
  );
  return response.data;
};

export const getSubscriptionsApi = async (
  page: number,
  limit: number,
  search = ""
) => {
  const response = await httpsCall.get(
    `admin/subscriptions/list/${page}/${limit}?search=${search}`
  );
  return response.data;
};
