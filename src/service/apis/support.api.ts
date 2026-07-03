import httpsCall from "../httpsCall";

export const getSupportRequests = async () => {
  const response = await httpsCall.get("/admin/support");
  return response.data;
};

export const replyToSupportRequest = async (
  id: string,
  adminReply: string
) => {
  const response = await httpsCall.patch(`/admin/support/resolve/${id}`, {
    adminReply,
  });
  return response.data;
};
