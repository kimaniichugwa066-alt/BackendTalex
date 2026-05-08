export const successResponse = (message: string, data: unknown = {}) => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message: string, errors: unknown = null) => ({
  success: false,
  message,
  errors,
});
