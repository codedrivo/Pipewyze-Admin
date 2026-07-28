import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";

export const searchPlumbers = catchAsync(
  async (search = "", page = 1, limit = 10, latitude?: number, longitude?: number, radius?: number) => {
    let url = `/public/licensed-plumber?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`;
    if (latitude !== undefined && longitude !== undefined) {
      url += `&latitude=${latitude}&longitude=${longitude}`;
    }
    if (radius !== undefined) {
      url += `&radius=${radius}`;
    }
    const data = await httpsCall.get(url);
    return data;
  }
);
