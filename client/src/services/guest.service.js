import api from "../lib/axios.js";

const executeGuestRequest = async ({
  method = "GET",
  url,
  headers = [],
  queryParams = [],
  body = {},
  auth = null,
}) => {
  const response = await api.post("/guest/execute", {
    method,
    url,
    headers,
    queryParams,
    body,
    auth,
  });
  return response.data?.data || response.data;
};

export default {
  executeGuestRequest,
};
