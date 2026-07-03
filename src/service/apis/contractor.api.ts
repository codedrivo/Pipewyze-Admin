import httpsCall from "../httpsCall";

// List Contractors
export const getContractorsApi = async (
  page: number,
  limit: number,
  search: string = ""
) => {
  try {
    const response = await httpsCall.post(
      `/admin/contractors/contractor-list/${page}/${limit}?search=${search}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Contractor Details by ID
export const getContractorByIdApi = async (id: string) => {
  try {
    const response = await httpsCall.get(
      `/admin/contractors/contractor-detail/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add Contractor
export const addContractorApi = async (payload: any) => {
  try {
    const response = await httpsCall.post(
      `/admin/contractors/add-contractor`,
      payload,
      {
        headers: {
          "x-skip-error-toast": "1",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update Contractor
export const updateContractorApi = async (id: string, payload: any) => {
  try {
    // If you add files later, you may need to use FormData and change headers.
    const response = await httpsCall.patch(
      `/admin/contractors/update-contractor/${id}`,
      payload,
      {
        headers: {
          "x-skip-error-toast": "1",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete Contractor
export const deleteContractorApi = async (id: string) => {
  try {
    const response = await httpsCall.delete(
      `/admin/contractors/remove-contractor/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
