export const response = (status?: number, message?: string, success?: boolean, data?: any) => ({
  meta: {
    message: message || "Ok",
    status: status || 200,
    success: success || true
  },
  data,
});