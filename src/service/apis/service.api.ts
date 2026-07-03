import httpsCall from "../httpsCall";

export const deleteServiceApi = async (id: string) => {
  const res = await httpsCall.delete(`/admin/service/delete-service/${id}`);
  return res.data;
};

export const serviceApi = async (values: any) => {
  const res = await httpsCall.post(
    `/admin/service/list/${values.currentPage}/${values.limit}`,
    values
  );
  return res.data;
};

export const createServiceApi = async (formData: FormData) => {
  const res = await httpsCall.post("/admin/service/add-service", formData);
  return res.data;
};

export const getServiceDetailsApi = async (id: string) => {
  const res = await httpsCall.get(`/admin/service/get-service/${id}`);
  return res.data;
};

export const updateServiceApi = async (id: string, formData: FormData) => {
  const res = await httpsCall.patch(`/admin/service/update-service/${id}`, formData);
  return res.data;
};

export const getPlansForDropdownApi = async () => {
  const res = await httpsCall.post(`/admin/plan/list/1/100`, {});
  return res.data;
};
