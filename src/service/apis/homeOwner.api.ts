import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const getHomeOwnerDashboard = catchAsync(async () => {
  const data = await httpsCall.get(`/public/home-owner/dashboard`);
  return data;
});
