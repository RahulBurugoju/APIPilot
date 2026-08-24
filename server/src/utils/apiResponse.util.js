// 400 → Validation / malformed request
// 401 → Authentication failure
// 403 → Authenticated but forbidden
// 404 → Resource not found
// 409 → Conflict
// 500 → Server error

export const successResponse = (
  res,
  statusCode,
  message,
  data = null
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res,
  statusCode,
  message,
  errors = null
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};