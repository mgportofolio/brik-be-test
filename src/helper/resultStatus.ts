export const resultStatus = (message?: string, success?: boolean, data?: any) => ({
  meta: {
    message: message || "Ok",
    success: success || true
  },
  data,
});