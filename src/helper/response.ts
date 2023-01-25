export const response = (
  status?: number,
  message?: any,
  success?: boolean,
  data?: any,
) => ({
  meta: {
    message: message || 'Ok',
    status: status || 200,
    success: success || true,
  },
  data,
});
