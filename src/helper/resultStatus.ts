export const resultStatus = (message?: any, success?: boolean, data?: any) => ({
  meta: {
    message: message || 'Ok',
    success: success ?? true,
  },
  data,
});
