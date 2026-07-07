import catchAsync from "../../utils/catchAsync";
import httpsCall from "../httpsCall";
import { IUsersRoleTable } from "../../interfaces/Itable";

export const userApi = catchAsync(async (values: any) => {
  const data = await httpsCall.post(
    `/admin/user/user-list/${values.currentPage}/${values.limit}`,
    values
  );
  return data;
});

export const userDetails = catchAsync(async (values) => {
  const response = await httpsCall.get(
    `/admin/user/edit-user/${values}`
  );
  return response;
});

export const addUser = catchAsync(async (values: IUsersRoleTable) => {
  const data = await httpsCall.post(`/admin/user/add-user`, values);
  return data;
});

export const deleteUser = catchAsync(async (uid) => {
  const data = await httpsCall.delete(
    `/admin/user/delete-user/${uid}`
  );
  return data;
});

export const updateUser = catchAsync(async (id, values: IUsersRoleTable) => {
  const data = await httpsCall.patch(
    `/admin/user/update-user/${id}`,
    values
  );
  return data;
});

export const updateProfile = catchAsync(async (values) => {
  const data = await httpsCall.patch(`/admin/profile/update`, values);
  return data;
});

export const updateProfileImage = catchAsync(async (values) => {
  const data = await httpsCall.patch(`/admin/profile/image-update`, values);
  return data;
});

export const userVerification = catchAsync(async (id: string, isVerified: boolean) => {
  const data = await httpsCall.patch(
    `/admin/user/verification/${id}`,
    { isVerfied: isVerified }
  );
  return data;
});

export const userBlockUnblock = catchAsync(async (id: string, isActive: boolean) => {
  const data = await httpsCall.patch(
    `/admin/user/block-unblock/${id}`,
    { isActive }
  );
  return data;
});


