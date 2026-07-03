// import axios from "axios";
// import toast from "react-hot-toast";
// import { logOut } from "../store/auth.store";
// import { store } from "../store/store";

// axios.interceptors.request.use(async (config: any) => {
//   config.baseURL = import.meta.env.VITE_API_BASE_URL;

//   const token = localStorage.getItem("access_token") ?? "";

//   if (token) {
//     config.headers["authorization"] = `Bearer ${token}`;
//   } else if (axios.defaults.headers.common["authorization"]) {
//     config.headers["authorization"] =
//       axios.defaults.headers.common["authorization"];
//   }
//   return config;
// });

// let retryCount = 0;
// const MAX_RETRIES = 3;
// let isLoggingOut = false;

// axios.interceptors.response.use(
//   async (response) => {
//     return response;
//   },
//   async (error) => {
//     const tokenExpired = error.response?.data?.tokenExpired || false;
//     const isUnauthorized = error.response?.status === 401;

//     if (tokenExpired && isUnauthorized && retryCount < MAX_RETRIES) {
//       const refreshToken = localStorage.getItem("refresh_token");

//       if (refreshToken) {
//         try {
//           const refreshResponse = await axios.post("/admin/refresh-tokens", {
//             token: refreshToken,
//           });

//           const { access, refresh } = refreshResponse.data.tokens || {};
//           if (access && refresh) {
//             localStorage.setItem("access_token", access);
//             localStorage.setItem("refresh_token", refresh);

//             error.config.headers["Authorization"] = `Bearer ${access}`;
//             retryCount++;
//             return axios(error.config);
//           }
//         } catch (refreshError) {
//           toast.error("Session expired. Please login again.");
//           retryCount = 0;
//         }
//       } else {
//         toast.error("No refresh token found. Please login again.");
//       }
//       if (isUnauthorized && !isLoggingOut) {
//         isLoggingOut = true;
//         const getstore = store;
//         getstore.dispatch(logOut());
//       }
//     }

//     toast.error(error.response?.data?.message || "Something went wrong.");
//     retryCount = 0;
//     let duplicateEmailerror = false;
//     if (error.response?.data?.message) {
//       duplicateEmailerror =
//         error.response &&
//         error.response?.data?.message &&
//         typeof error.response?.data?.message === "string"
//           ? /duplicate key/.test(error.response?.data?.message) &&
//             /email:/.test(error.response?.data?.message)
//           : false;
//     }
//     if (!duplicateEmailerror) {
//       if (
//         error.response?.data?.message === "Token blacklisted" ||
//         error.response?.data?.message === "Please authenticate"
//       ) {
//         import("../store/store").then(({ store }) => {
//           import("../store/auth.store").then(({ logOut }) => {
//             store.dispatch(logOut());
//           });
//         });
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// // Exporting axios call methods
// const httpsCall = {
//   get: axios.get,
//   post: axios.post,
//   put: axios.put,
//   delete: axios.delete,
//   patch: axios.patch,
//   interceptors: axios.interceptors,
// };

// export default httpsCall;
import axios from "axios";
import toast from "react-hot-toast";
import { logOut } from "../store/auth.store";
import { store } from "../store/store";

axios.interceptors.request.use(async (config: any) => {
  config.baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("access_token") ?? "";

  if (token) {
    config.headers["authorization"] = `Bearer ${token}`;
  } else if (axios.defaults.headers.common["authorization"]) {
    config.headers["authorization"] =
      axios.defaults.headers.common["authorization"];
  }
  return config;
});

let retryCount = 0;
const MAX_RETRIES = 3;
let isLoggingOut = false;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const tokenExpired = error.response?.data?.tokenExpired || false;
    const isUnauthorized = error.response?.status === 401;
    let errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.response?.data?.err || 
      "Something went wrong.";

    // Handle common HTTP status codes that might not have a message in the body
    if (!error.response?.data?.message) {
      if (error.response?.status === 413) {
        errorMessage = "File size too large. Please upload smaller files.";
      } else if (error.response?.status === 502 || error.response?.status === 504) {
        errorMessage = "Server is temporarily unavailable. Please try again later.";
      } else if (error.response?.status === 500) {
        errorMessage = "Internal Server Error. Please contact support.";
      } else if (!error.response) {
        errorMessage = "Network error. Please check your internet connection.";
      }
    }

    // Handle Mongo duplicate key errors (e.g., duplicate email/phone)
    if (errorMessage.includes("E11000 duplicate key error")) {
      if (errorMessage.toLowerCase().includes("email")) {
        errorMessage = "This email address is already in use.";
      } else if (errorMessage.toLowerCase().includes("phone")) {
        errorMessage = "This phone number is already in use.";
      } else {
        errorMessage = "A record with this information already exists.";
      }
    }
    const shouldSkipGlobalErrorToast =
      error?.config?.skipErrorToast === true ||
      error?.config?.silent === true ||
      error?.config?.headers?.["x-skip-error-toast"] === "1" ||
      error?.config?.headers?.["X-Skip-Error-Toast"] === "1";

    // 1. Handle Token Refresh logic
    if (tokenExpired && isUnauthorized && retryCount < MAX_RETRIES) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const refreshResponse = await axios.post("/admin/refresh-tokens", {
            token: refreshToken,
          });
          const { access, refresh } = refreshResponse.data.tokens || {};
          if (access && refresh) {
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);
            error.config.headers["Authorization"] = `Bearer ${access}`;
            retryCount++;
            return axios(error.config);
          }
        } catch (refreshError) {
          toast.error("Session expired. Please login again.", {
            id: "auth-error",
          });
          retryCount = 0;
          return Promise.reject(refreshError); // EXIT HERE
        }
      }

      if (!isLoggingOut) {
        isLoggingOut = true;
        store.dispatch(logOut());
      }
      return Promise.reject(error); // EXIT HERE
    }

    // 2. Specialized Error Handling (e.g., Auth failures)
    if (
      errorMessage === "Token blacklisted" ||
      errorMessage === "Please authenticate"
    ) {
      store.dispatch(logOut());
      return Promise.reject(error); // EXIT HERE
    }

    // 3. Global Error Toast
    // Using an 'id' prevents multiple pop-ups of the SAME error from stacking
    if (!shouldSkipGlobalErrorToast) {
      toast.error(errorMessage, { id: "global-api-error" });
    }

    retryCount = 0;
    return Promise.reject(error);
  }
);

const httpsCall = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  patch: axios.patch,
  interceptors: axios.interceptors,
};

export default httpsCall;
