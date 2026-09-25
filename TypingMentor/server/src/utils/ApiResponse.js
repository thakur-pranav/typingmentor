export function sendSuccess(res, statusCode, message, data) {
  const body = { success: true, message, data };
  return res.status(statusCode).json(body);
}
