// import httpsCall from "../httpsCall";

// export const getSubscriptionsListApi = async (params: any) => {
//   const res = await httpsCall.get(
//     `/admin/subscription/list/${params.currentPage}/${params.limit}`,
//     { params: { search: params.search } }
//   );
//   return res.data;
// };

import httpsCall from "../httpsCall";

export const getSubscriptionsListApi = async (params?: any) => {
  const page = params?.currentPage || 1;
  const limit = params?.limit || 10;
  const search = params?.search || "";

  const res = await httpsCall.get(
    `/admin/subscriptions/list/${page}/${limit}`,
    {
      params: { search },
    }
  );

  return res.data;
};
