import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const getMyOrders = catchAsync(async () => {
  const data = await httpsCall.get("/orders");
  return data;
});

export const getAdminOrders = catchAsync(async () => {
  const data = await httpsCall.get("/admin/orders");
  return data;
});

export const getOrderByOrderId = catchAsync(async (orderId: string) => {
  const data = await httpsCall.get(`/admin/orders/${orderId}`);
  return data;
});

export const updateOrderStatus = catchAsync(
  async (orderId: string, orderStatus: string) => {
    const data = await httpsCall.patch(`/admin/orders/${orderId}/status`, {
      orderStatus,
    });
    return data;
  }
);

export const syncOrderPaymentStatus = catchAsync(async (values: any) => {
  const data = await httpsCall.post("/orders/stripe/sync-payment", values);
  return data;
});

export const assignOrderContractor = catchAsync(
  async (orderId: string, contractorId: string) => {
    const data = await httpsCall.patch(`/admin/orders/${orderId}/assign-contractor`, {
      contractorId,
    });
    return data;
  }
);
